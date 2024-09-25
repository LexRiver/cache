import { Async } from "@lexriver/async"
import { expect, test } from 'vitest'
import { CachedMap } from "./CachedMap.mjs"

async function waitMsAsync(ms:number){
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}


test('CachedMap', async () => {
    let counter:number = 100
    let cm = new CachedMap<string, string>({
        maxAgeInMilliseconds: 500,
        updateFunction: async (key:string)=>{
            await Async.waitMsAsync(200)
            return Promise.resolve(`${key}${++counter}`)
        }, 
        useLazyUpdate: true
    })

    expect(await cm.getAsync('a')).toEqual('a101')
    expect(await cm.getAsync('a')).toEqual('a101')
    expect(await cm.getAsync('b')).toEqual('b102')
    await waitMsAsync(505)
    expect(await cm.getAsync('a')).toEqual('a103')
    expect(await cm.getAsync('b')).toEqual('b104')
})

test('CachedMap', async () => {
    let counter:number = 100
    let cm = new CachedMap<string, string>({
        maxAgeInMilliseconds: 500, 
        updateFunction: async (key:string) => {
            counter++
            return key+counter
        }
    })
    expect(await cm.getAsync('a')).toEqual('a101')
})


// test('CachedMap by key object', async () => {
//     let counter:number = 100
//     interface InterfaceKey{
//         n:number
//         s:string
//     }
//     let cm = new CachedMap<InterfaceKey, string>(500, (key:InterfaceKey) => Promise.resolve(`${key.n},${key.s},${++counter}`))

//     expect(await cm.getAsync({n:10, s:'some string'})).toEqual(`10,some string,101`)
//     expect(await cm.getAsync({n:10, s:'some string'})).toEqual(`10,some string,101`)
//     await waitMsAsync(501)
//     expect(await cm.getAsync({n:10, s:'some string'})).toEqual(`10,some string,102`)
//     expect(await cm.getAsync({n:10, s:'some string'})).toEqual(`10,some string,102`)

// })

// test('CachedMap clearCache', async () => {
//     let counter:number = 100
//     let cm = new CachedMap<string, string>(500, (key:string)=>{
//         return Promise.resolve(`${key}${++counter}`)
//     })

//     expect(await cm.getAsync('a')).toEqual('a101')
//     expect(await cm.getAsync('a')).toEqual('a101')
//     expect(await cm.getAsync('b')).toEqual('b102')
//     cm.clearCache()
//     expect(await cm.getAsync('a')).toEqual('a103')
//     expect(await cm.getAsync('b')).toEqual('b104')

// })