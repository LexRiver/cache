import { Async } from "@lexriver/async"
import { expect, test } from 'vitest'
import { CachedVariable } from "./CachedVariable.mjs"

test('CachedVariable', async () => {
    let counter = 4
    let c = new CachedVariable<number>({useLazyUpdate:true, maxAgeInMilliseconds: 500, updateFunction: async () => ++counter}) 
    //console.log('get first value 5')
    expect(await c.getAsync()).toEqual(5)
    //console.log('trying to get again first value')
    expect(await c.getAsync()).toEqual(5)
    //console.log('waiting...')
    await Async.waitMsAsync(1000)
    expect(await c.getAsync()).toEqual(6)
    await Async.waitMsAsync(1000)
    expect(await c.getAsync()).toEqual(7)
})

test('CachedVariable clear cache', async () => {
    let counter = 4
    let c = new CachedVariable<number>({useLazyUpdate:true, maxAgeInMilliseconds: 500, updateFunction: async () => ++counter})
    expect(await c.getAsync()).toEqual(5)
    expect(await c.getAsync()).toEqual(5)
    await c.clearCacheAsync()
    expect(await c.getAsync()).toEqual(6)
    await c.clearCacheAsync()
    expect(await c.getAsync()).toEqual(7)

})

test('CachedVariable auto dispose', async () => {
    let counter = 100
    const x = new CachedVariable<number>({maxAgeInMilliseconds: 100, updateFunction: () => { 
        console.log('@call updateFunction')
        return counter++
    }, useLazyUpdate: true})
    //waitMsAsync(100)
    expect(x.hasValue).toBeFalsy()
    let value = await x.getAsync()
    expect(value).toEqual(100)
    expect(x.hasValue).toBeTruthy()
    await Async.waitMsAsync(100)
    expect(x.hasValue).toBeFalsy()
    value = await x.getAsync() 
    expect(value).toEqual(101)
    await Async.waitMsAsync(105)
})


test('CachedVariable clear cache dispose', async () => {
    const c = new CachedVariable<string[]>({
        maxAgeInMilliseconds: 500, 
        updateFunction: (prev) => {
            //console.log('updating dates...', 'prev=', prev)
            prev = prev ? prev : []
            prev.push(new Date().toISOString())
            //console.log('result=', prev)
            return prev
        },
        useLazyUpdate: true
    })
    c.onDisposeEvent.subscribe(() => {
        console.log('disposing')
    })

    expect((await c.getAsync()).length).toEqual(1)
    await Async.waitMsAsync(700)
    expect((await c.getAsync()).length).toEqual(1)
    await c.clearCacheAsync()
    expect((await c.getAsync()).length).toEqual(1)
    await Async.waitMsAsync(700)
    expect((await c.getAsync()).length).toEqual(1)
    console.log('at end values=', await c.getAsync())
})
