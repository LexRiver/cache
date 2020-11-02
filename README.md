# Cache

This package provides 

* `BoxedValue<T>`
* `CachedVariable<T>`
* `CachedMap<K,V>`

for caching your data

## Install
```
npm install @lexriver/cache
```

<br/>
<br/>

## `CachedVariable<T>`

```typescript
    const myCachedVariable = new CachedVariable<string>(options)
```

where `options` is an object of type
```typescript
{
    maxAgeInMilliseconds:number, 
    updateFunction:(prevValue?:T)=>Promise<T>|T, 
    initialValue?:T
    useLazyUpdate?:boolean
}
```

* `maxAgeInMilliseconds:number` is a timeout before updating the value
* `updateFunction:(prevValue?:T)=>Promise<T>|T` is a function that will be executed to update value
* `initialValue?:T` is a initial value, default is `undefined`
* `useLazyUpdate?:boolean` if true then stale value will be updated only on `getAsync()` method


Example
```typescript
    const myCachedVariable = new CachedVariable<string>({
        maxAgeInMilliseconds:5000, 
        updateFunction:(prevValue:string)=>{
            return prevValue+'+'
        } 
        initialValue:'default value'
    })
```

### `setUpdateFunction(updateFunctionAsync:(prevValue?:T)=>Promise<T>|T)`

Change the update function

```typescript
    myCachedVariable.setUpdateFunction((prevValue:string)=>prevValue+'!')
```

<br/>

### `async getAsync():Promise<T>`

Returns cached value if possible or executes updateFunctionAsync to get a new value

```typescript
    await myCachedVariable.getAsync()
```

<br/>

### `async updateWithValueAsync(value:T)`

Set new value

```typescript
    await myCachedVariable.updateWithValueAsync('my new value')
```

<br/>

### `async clearCacheAsync()`

Remove any existing value from cache

```typescript
    await myCachedVariable.clearCacheAsync()
```

<br/>

### `hasValue:boolean`

Check if there is some value in cache

```typescript
    if(myCachedVariable.hasValue) {...}
```

<br/>

### `onDisposeEvent:TypeEvent<()=>void>`

[Event](https://www.npmjs.com/package/@lexriver/type-event) that triggers when `clearCacheAsync()` is executed

```typescript
    myCachedVariable.onDisposeEvent.subscribe(() => {
        console.log('myCachedVariable is empty')
    })
```



<br/><br/>
<hr/>
<br/><br/>



## `CachedMap<K,V>`

```typescript
    const myCachedMap = new CachedMap<K, V>(options)
```
`K` is a type for key, and `V` is a value type.

`K` can be `number`, `boolean`, `string`, `Object`, or interface

`options` is an object of type
```typescript
{
    maxAgeInMilliseconds:number, 
    updateFunction:(key:K)=>Promise<V>|V, 
    useLazyUpdate?:boolean
}
```

* `maxAgeInMilliseconds:number` is a timeout before updating the value
* `updateFunction:(key:K)=>Promise<V>|V` is a function that will be executed to update value
* `useLazyUpdate?:boolean` if true then stale value will be updated only on `getAsync()` method

<br/>


__Example__

```typescript
interface MyInterface{
    text:string
}
let myCachedMap2 = new CachedMap<MyInterface, number>({
    maxAgeInMilliseconds: 100*1000,
    updateFunction: async (key:MyInterface) => {
        let result = await makeSomeRequestAsync(key)
        // ..
        return result
    }
})
```


<br/>

### `setUpdateFunction(updateFunctionAsync:(key:K)=>Promise<V>|V)`

Change the update function.

```typescript
    myCachedMap.setUpdateFunction((key:K) => key+'!')
```

<br/>

### `async getAsync(key:K):Promise<V>`

Get value by key.

```typescript
    const result = await myCachedMap.getAsync()
```

<br/>

### `clearCache()`

Clear cache and force to update all values.

```typescript
    myCachedMap.clearCache()
```

<br/>

### `clearCacheForKey(key:K)`

force to update value only for specified key.

```typescript
    myCahcedMap.clearCacheForKey('myKey')
```

<br/><br/>
<hr/>
<br/><br/>

## `BoxedValue<T>`

BoxedValue is a wrapper for any value. Value can be undefined.

__Example__

```typescript
    let x = new BoxedValue<number|undefined>()
    x.hasValue // false

    x.set(undefined)
    x.hasValue // true
    x.getOrThrow() // undefined

    x.set(100)
    x.getOrThrow() // 100
```

<br/>

### constructor

```typescript
    let myBoxedValue = new BoxedValue<T>(initialValue?:T)
```

__Example__

```typescript
    let myBoxedValue = new BoxedValue<number>(100)
```

<br/>

### `get hasValue():boolean`

Check if box has a value

```typescript
    myBoxedValue.hasValue // true or false
```

<br/>

### `get isEmpty():boolean`

Check if box is empty

```typescript
    myBoxedValue.isEmpty // true or false
```

<br/>

### `set(value:T)`

Set new value

```typescript
    myBoxedValue.set(100)
```

<br/>

### `setByPrevious(action:(previousValue?:T)=>T)`

Set new value by previous value

```typescript
    myBoxedValue.setByPrevious((prev:number) => prev+1)
```

<br/>

### `getOrThrow()`

Return value if exists else throw a error

```typescript
    try {
        let currentValue = myBoxedValue.getOrThrow()
        console.log('value exists, currentValue=', currentValue)

    } catch(x){
        console.error('no value', x)

    }
```

<br/>

### `getOrUndefined():T|undefined`

Return value if exists else return undefined

```typescript
    const myBoxedValue = new BoxedValue<number>()
    myBoxedValue.getOrUndefined() // undefined
    myBoxedValue.set(100)
    myBoxedValue.getOrUndefined() // 100
```

<br/>

### `deleteValue()`

Delete value if exists

```typescript
    myBoxedValue.set(100)
    myBoxedValue.getOrUndefined() // 100
    myBoxedValue.deleteValue()
    myBoxedValue.hasValue //false
    myBoxedValue.getOrUndefined() // undefined
```

<br/>

### `get lastModifactionDate()`

Returns last modification date.

If no value has been set yet then retuns date when instance was created.

```typescript
    console.log('last modification date = ', myBoxedValue.lastModificationDate)
```
