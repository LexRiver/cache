import { BoxedValue } from "./BoxedValue"

async function test(){
    let x = new BoxedValue<number>(0)
    let hasValue = x.hasValue
    console.log('hasValue=', hasValue)
    //x = 5
    //expect(hasValue).toBeTruthy()

}

test()
