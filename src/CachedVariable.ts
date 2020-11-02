import { Async } from "@lexriver/async"
import { TypeEvent } from "@lexriver/type-event"
import { BoxedValue } from "./BoxedValue"


/**
 * Returns cached value if available.
 * Cached value becomes undefined by timer after assign.
 * On `get` request it will be async updated if not assign
 */
export class CachedVariable<T>{
    public onDisposeEvent:TypeEvent<()=>void> = new TypeEvent<()=>void>()
    protected timer:any
    protected valueB:BoxedValue<T> = new BoxedValue<T>()

    constructor(
        protected p:{
            maxAgeInMilliseconds:number, 
            updateFunction:(prevValue?:T)=>Promise<T>|T, 
            initialValue?:T
            useLazyUpdate?:boolean
        }) 
    {
        if(p.maxAgeInMilliseconds<=0) throw new Error(`Wrong maxAgeInSeconds=${p.maxAgeInMilliseconds}`)
        if(p.initialValue !== undefined){
            this.valueB.set(p.initialValue)
        }
        //if(!p.updateFunction) throw new Error('No updateFunction')

        if(!p.useLazyUpdate){
            this.startUpdateByTimer()
        }
    }

    protected async startUpdateByTimer(){
        await this.updateAsync()
        //await Async.waitMsAsync(this.p.maxAgeInMilliseconds-1)
        setTimeout(() => {
            this.startUpdateByTimer()
        }, this.p.maxAgeInMilliseconds-1)
    }



    public setUpdateFunction(updateFunctionAsync:(prevValue?:T)=>Promise<T>|T){
        this.p.updateFunction = updateFunctionAsync
    }


    /**
     * returns cached value if possible or executes updateFunctionAsync to get a new value
     */
    async getAsync():Promise<T>{
        if(this.valueB.isEmpty){
            // if(this.p.useLazyUpdate){
                if(!this.isUpdatingNow){
                    await this.updateAsync()

                } else {
                    await this.waitForUpdate()

                }
            // } else {
            //     await 
            // }
        }
        //if(this.value === undefined) throw new Error('undefined result in cached variable')
        return this.valueB.getOrThrow()
    }

    protected async waitForUpdate(){
        let waitMs = 2
        while(this.isUpdatingNow){
            await Async.waitMsAsync(waitMs)
            if(waitMs < 10*1000) {
                waitMs *= 2
            }
        }
    }

    protected isUpdatingNow:boolean = false
    protected async updateAsync(){
        this.isUpdatingNow = true
        try {
            this.valueB.set(await this.p.updateFunction(this.valueB.getOrUndefined()))
            this.isUpdatingNow = false
            if(this.p.useLazyUpdate){
                this.disposeValueByTimer()
            }

        } catch(x){
            console.error('CachedVariable: error while updating', x)
            throw x
        }
    }

    public async updateWithValueAsync(value:T){
        await this.waitForUpdate()
        this.valueB.set(value)
        this.disposeValueByTimer()
    }


    /**
     * clears cache and load new value (if not lazyUpdate)
     */
    public async clearCacheAsync(){
        await this.waitForUpdate()
        this.valueB.deleteValue()
        this.onDisposeEvent.triggerAsync()
    }

    protected disposeValueByTimer(){
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            //console.log('removing variable from memory by timeout')
            this.clearCacheAsync()

        }, this.p.maxAgeInMilliseconds)
        //console.log('setting timer', this.timer)
    }

    public get hasValue(){
        return this.valueB.hasValue
    }

    
}