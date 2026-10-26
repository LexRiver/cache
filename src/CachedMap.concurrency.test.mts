import { afterEach, describe, expect, test, vi } from 'vitest'
import { CachedMap } from './CachedMap.mjs'

function deferred<T>(){
    let resolve!:(value:T|PromiseLike<T>)=>void
    const promise = new Promise<T>(resolvePromise => {
        resolve = resolvePromise
    })
    return {promise, resolve}
}

afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
})

describe('CachedMap concurrency', () => {
    test('shares one update per key between 100 concurrent getters', async () => {
        const updateGate = deferred<number>()
        let attempts = 0
        const cache = new CachedMap<string, number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: () => {
                attempts++
                return updateGate.promise
            },
        })

        const requests = Array.from({length: 100}, () => cache.getAsync('a'))
        await Promise.resolve()
        expect(attempts).toBe(1)
        updateGate.resolve(42)

        await expect(Promise.all(requests)).resolves.toEqual(Array(100).fill(42))
        expect(attempts).toBe(1)
    })

    test('clearCacheForKey can overlap an update and waiting getter', async () => {
        const updateGate = deferred<void>()
        let attempts = 0
        const cache = new CachedMap<string, number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: async () => {
                attempts++
                await updateGate.promise
                return 42
            },
        })

        const updatingRequest = cache.getAsync('a')
        const clearingRequest = cache.clearCacheForKey('a')
        const waitingRequest = cache.getAsync('a')
        updateGate.resolve()

        await expect(updatingRequest).resolves.toBe(42)
        await expect(clearingRequest).resolves.toBeUndefined()
        await expect(waitingRequest).resolves.toBe(42)
        expect(attempts).toBe(2)
    })

    test('clearing one key does not affect another key', async () => {
        const attempts = new Map<string, number>()
        const cache = new CachedMap<string, string>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: key => {
                const attempt = (attempts.get(key) ?? 0) + 1
                attempts.set(key, attempt)
                return `${key}-${attempt}`
            },
        })

        await expect(cache.getAsync('a')).resolves.toBe('a-1')
        await expect(cache.getAsync('b')).resolves.toBe('b-1')
        await cache.clearCacheForKey('a')
        await expect(cache.getAsync('a')).resolves.toBe('a-2')
        await expect(cache.getAsync('b')).resolves.toBe('b-1')
    })

    test('clearCache does not reuse a stale result from the old map', async () => {
        const oldUpdate = deferred<string>()
        let attempts = 0
        const cache = new CachedMap<string, string>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: () => {
                attempts++
                return attempts === 1 ? oldUpdate.promise : 'new'
            },
        })

        const oldRequest = cache.getAsync('a')
        await cache.clearCache()
        const newRequest = cache.getAsync('a')

        await expect(newRequest).resolves.toBe('new')
        oldUpdate.resolve('old')
        await expect(oldRequest).resolves.toBe('new')
        expect(attempts).toBe(3)
    })

    test('a failed update can retry without blocking another key', async () => {
        let aAttempts = 0
        const cache = new CachedMap<string, string>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: key => {
                if(key === 'a' && ++aAttempts === 1){
                    throw new Error('temporary failure')
                }
                return `${key}-value`
            },
        })

        await expect(cache.getAsync('a')).rejects.toThrow('temporary failure')
        await expect(cache.getAsync('b')).resolves.toBe('b-value')
        await expect(cache.getAsync('a')).resolves.toBe('a-value')
        expect(aAttempts).toBe(2)
    })

    test('an old key expiration cannot invalidate a newer value', async () => {
        vi.useFakeTimers()
        let attempts = 0
        const cache = new CachedMap<string, number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 100,
            updateFunction: () => ++attempts,
        })

        await expect(cache.getAsync('a')).resolves.toBe(1)
        await vi.advanceTimersByTimeAsync(50)
        await cache.clearCacheForKey('a')
        await expect(cache.getAsync('a')).resolves.toBe(2)
        await vi.advanceTimersByTimeAsync(50)
        await expect(cache.getAsync('a')).resolves.toBe(2)
        expect(attempts).toBe(2)
    })
})
