import { TypeEvent } from "@lexriver/type-event"
import { BoxedValue } from "./BoxedValue.mjs"


/**
 * Returns cached value if available.
 * Cached value becomes undefined by timer after assign.
 * On `get` request it will be async updated if not assign
 */
export class CachedVariable<T>{
    public onDisposeEvent:TypeEvent<()=>void> = new TypeEvent<()=>void>()
    protected expirationTimer?:ReturnType<typeof setTimeout>
    protected periodicUpdateTimer?:ReturnType<typeof setTimeout>
    protected valueB:BoxedValue<T> = new BoxedValue<T>()
    protected updatePromise?:Promise<T>
    protected updateGeneration?:number
    protected generation = 0

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
            void this.startUpdateByTimer()
        }
    }

    protected async startUpdateByTimer():Promise<void>{
        try {
            await this.updateAsync()
        } catch(x) {
            console.error('CachedVariable: error while updating', x)
        } finally {
            this.periodicUpdateTimer = setTimeout(() => {
                void this.startUpdateByTimer()
            }, this.p.maxAgeInMilliseconds)
        }
    }



    public setUpdateFunction(updateFunctionAsync:(prevValue?:T)=>Promise<T>|T){
        this.p.updateFunction = updateFunctionAsync
    }


    /**
     * returns cached value if possible or executes updateFunctionAsync to get a new value
     */
    async getAsync():Promise<T>{
        while(true){
            if(this.valueB.hasValue){
                return this.valueB.getOrThrow()
            }

            const updatePromise = this.updateAsync()
            const updateGeneration = this.updateGeneration!

            try {
                const value = await updatePromise
                if(this.generation === updateGeneration){
                    return value
                }
            } catch(x) {
                if(this.generation === updateGeneration){
                    throw x
                }
            }
        }
    }

    protected updateAsync():Promise<T>{
        if(this.updatePromise){
            return this.updatePromise
        }

        const updateGeneration = this.generation
        const previousValue = this.valueB.getOrUndefined()
        const performUpdate = Promise.resolve()
            .then(() => this.p.updateFunction(previousValue))
            .then(value => {
                if(this.generation === updateGeneration){
                    this.valueB.set(value)
                    if(this.p.useLazyUpdate){
                        this.disposeValueByTimer(updateGeneration)
                    }
                }
                return value
            })

        let updatePromise!:Promise<T>
        updatePromise = performUpdate.finally(() => {
            if(this.updatePromise === updatePromise){
                this.updatePromise = undefined
                this.updateGeneration = undefined
            }
        })

        this.updateGeneration = updateGeneration
        this.updatePromise = updatePromise
        return updatePromise
    }

    public async updateWithValueAsync(value:T):Promise<void>{
        this.invalidateCurrentValue()
        this.valueB.set(value)
        if(this.p.useLazyUpdate){
            this.disposeValueByTimer(this.generation)
        }
    }


    /**
     * clears cache and load new value (if not lazyUpdate)
     */
    public async clearCacheAsync():Promise<void>{
        this.invalidateCurrentValue()
        await this.onDisposeEvent.trigger()
    }

    protected invalidateCurrentValue():void{
        this.generation++
        clearTimeout(this.expirationTimer)
        this.expirationTimer = undefined
        this.valueB.deleteValue()
    }

    protected disposeValueByTimer(valueGeneration:number):void{
        clearTimeout(this.expirationTimer)
        this.expirationTimer = setTimeout(() => {
            if(this.generation !== valueGeneration){
                return
            }
            void this.clearCacheAsync().catch(x => {
                console.error('CachedVariable: error while disposing', x)
            })
        }, this.p.maxAgeInMilliseconds)
    }

    public get hasValue(){
        return this.valueB.hasValue
    }

    
}