import { Async } from "@lexriver/async"
import { expect, test } from 'vitest'
import { CachedVariable } from "./CachedVariable.mjs"


test('CachedVariable', async () => {
    let c = new CachedVariable<string>({
        maxAgeInMilliseconds: 500, 
        initialValue: 'a',
        updateFunction: async (x) => { 
            //console.log('-- calling updateFunction')
            await Async.waitMsAsync(200)
            x = x+'!'
            //console.log('-- returning new value:', x)
            return x
        },
    })
    expect(await c.getAsync()).toEqual('a')
    expect(await c.getAsync()).toEqual('a')
    await Async.waitMsAsync(501)
    expect(await c.getAsync()).toEqual('a!')
    await Async.waitMsAsync(503)
    expect(await c.getAsync()).toEqual('a!!')
    
})

test('CachedVariable without lazyUpdate - clear cache', async () => {
    let x = 5
    let c = new CachedVariable<number>({maxAgeInMilliseconds: 500, updateFunction: async () => { x = x+1; return x}})
    expect(await c.getAsync()).toEqual(6)
    await c.clearCacheAsync()
    expect(await c.getAsync()).toEqual(7)
})

test('CachedVariable clear cache (2)', async () => {
    const c = new CachedVariable<string[]>({
        maxAgeInMilliseconds: 500, 
        updateFunction: (prev) => {
            //console.log('updating dates...', 'prev=', prev)
            prev = prev ? prev : []
            prev.push(new Date().toISOString())
            //console.log('result=', prev)
            return prev
        },
        useLazyUpdate: false
    })
    c.onDisposeEvent.subscribe(() => {
        console.log('disposing')
    })

    expect((await c.getAsync()).length).toEqual(1)
    await Async.waitMsAsync(700)
    expect((await c.getAsync()).length).toEqual(2)
    await c.clearCacheAsync()
    expect((await c.getAsync()).length).toEqual(1)
    await Async.waitMsAsync(700)
    expect((await c.getAsync()).length).toEqual(2)
    console.log('at end values=', await c.getAsync())
})



