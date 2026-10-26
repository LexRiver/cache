import { afterEach, describe, expect, test, vi } from 'vitest'
import { CachedVariable } from './CachedVariable.mjs'

function deferred<T>(){
    let resolve!:(value:T|PromiseLike<T>)=>void
    let reject!:(reason?:unknown)=>void
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise
        reject = rejectPromise
    })
    return {promise, resolve, reject}
}

afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
})

describe('CachedVariable concurrency', () => {
    test('does not lose a value when clear overlaps an update and waiting getter', async () => {
        const updateGate = deferred<void>()
        let attempts = 0
        const cache = new CachedVariable<number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: async () => {
                attempts++
                await updateGate.promise
                return 42
            },
        })

        const updatingRequest = cache.getAsync()
        const clearingRequest = cache.clearCacheAsync()
        const waitingRequest = cache.getAsync()

        updateGate.resolve()

        await expect(updatingRequest).resolves.toBe(42)
        await expect(clearingRequest).resolves.toBeUndefined()
        await expect(waitingRequest).resolves.toBe(42)
        expect(attempts).toBe(2)
    })

    test('shares one in-flight update between at least 100 getters', async () => {
        const updateGate = deferred<number>()
        let attempts = 0
        const cache = new CachedVariable<number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: () => {
                attempts++
                return updateGate.promise
            },
        })

        const requests = Array.from({length: 100}, () => cache.getAsync())
        await Promise.resolve()
        expect(attempts).toBe(1)

        updateGate.resolve(42)
        await expect(Promise.all(requests)).resolves.toEqual(Array(100).fill(42))
        expect(attempts).toBe(1)
    })

    test('propagates a failed update and allows a later retry', async () => {
        let attempts = 0
        const cache = new CachedVariable<number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: async () => {
                attempts++
                if(attempts === 1){
                    throw new Error('temporary failure')
                }
                return 42
            },
        })

        const currentRequests = [cache.getAsync(), cache.getAsync()]
        await expect(Promise.all(currentRequests)).rejects.toThrow('temporary failure')
        await expect(cache.getAsync()).resolves.toBe(42)
        expect(attempts).toBe(2)
    })

    test('does not commit or return an update invalidated before completion', async () => {
        const firstUpdate = deferred<number>()
        let attempts = 0
        const cache = new CachedVariable<number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: () => {
                attempts++
                return attempts === 1 ? firstUpdate.promise : 2
            },
        })

        const request = cache.getAsync()
        await cache.clearCacheAsync()
        firstUpdate.resolve(1)

        await expect(request).resolves.toBe(2)
        await expect(cache.getAsync()).resolves.toBe(2)
        expect(attempts).toBe(2)
    })

    test('preserves undefined as a cached value', async () => {
        let attempts = 0
        const cache = new CachedVariable<undefined>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 60_000,
            updateFunction: () => {
                attempts++
                return undefined
            },
        })

        await expect(cache.getAsync()).resolves.toBeUndefined()
        await expect(cache.getAsync()).resolves.toBeUndefined()
        expect(cache.hasValue).toBe(true)
        expect(attempts).toBe(1)
    })

    test('an older expiration timer cannot delete a newer value', async () => {
        vi.useFakeTimers()
        const cache = new CachedVariable<number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 100,
            updateFunction: () => 1,
        })

        await expect(cache.getAsync()).resolves.toBe(1)
        await vi.advanceTimersByTimeAsync(50)
        await cache.updateWithValueAsync(2)
        await vi.advanceTimersByTimeAsync(50)

        expect(cache.hasValue).toBe(true)
        await expect(cache.getAsync()).resolves.toBe(2)

        await vi.advanceTimersByTimeAsync(50)
        expect(cache.hasValue).toBe(false)
    })

    test('non-lazy periodic updates continue after a failed update', async () => {
        vi.useFakeTimers()
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
        let attempts = 0
        const cache = new CachedVariable<number>({
            maxAgeInMilliseconds: 100,
            updateFunction: async () => {
                attempts++
                if(attempts === 1){
                    throw new Error('temporary failure')
                }
                return 42
            },
        })

        await vi.advanceTimersByTimeAsync(0)
        expect(attempts).toBe(1)
        await vi.advanceTimersByTimeAsync(100)

        await expect(cache.getAsync()).resolves.toBe(42)
        expect(attempts).toBe(2)
    })

    test('handles rejection from a timer-triggered disposal event', async () => {
        vi.useFakeTimers()
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const cache = new CachedVariable<number>({
            useLazyUpdate: true,
            maxAgeInMilliseconds: 100,
            updateFunction: () => 42,
        })
        cache.onDisposeEvent.subscribe(async () => {
            throw new Error('dispose subscriber failed')
        })

        await cache.getAsync()
        await vi.advanceTimersByTimeAsync(100)

        expect(cache.hasValue).toBe(false)
        expect(consoleError).toHaveBeenCalledWith(
            'CachedVariable: error while disposing',
            expect.objectContaining({message: 'dispose subscriber failed'}),
        )
    })
})
