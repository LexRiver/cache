import { BoxedValue } from "./BoxedValue"

test('initial value', () => {
    let x = new BoxedValue<number>(0)
    let hasValue = x.hasValue
    //console.log('hasValue=', hasValue)
    expect(hasValue).toBeTruthy()
})

test('no initial value', () => {
    let x = new BoxedValue<number>()
    expect(x.hasValue).toBeFalsy()
    expect(() => {x.getOrThrow()}).toThrow()
    expect(x.getOrUndefined()).toBeUndefined()
})

test('undefined value', () => {
    let x = new BoxedValue<number|undefined>()
    expect(x.hasValue).toBeFalsy()
    x.set(undefined)
    expect(x.hasValue).toBeTruthy()
    expect(x.getOrThrow()).toBeUndefined()
    x.set(100)
    expect(x.getOrThrow()).toEqual(100)
})

test('check value', () => {
    let x = new BoxedValue<number>()
    x.set(100)
    expect(x.getOrThrow()).toEqual(100)
    expect(x.getOrUndefined()).toEqual(100)
})

test('set by previous', () => {
    let x = new BoxedValue<number>(100)
    x.setByPrevious((prev) => prev ? prev+10 : 10)
    expect(x.getOrThrow()).toEqual(110)
})

test('delete value', () => {
    let x = new BoxedValue<number>(100)
    x.deleteValue()
    expect(x.getOrUndefined()).toBeUndefined()
})