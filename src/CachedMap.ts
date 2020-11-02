import { CachedVariable } from "./CachedVariable";
import {JsonMap} from "@lexriver/json-map"

export class CachedMap<K,V>{
    protected internalMap = new JsonMap<K, CachedVariable<V>>()

    constructor(
        protected p:{
            maxAgeInMilliseconds:number, 
            updateFunction:(key:K)=>Promise<V>|V, 
            useLazyUpdate?:boolean
        }
    ){
        if(p.maxAgeInMilliseconds<=0) throw new Error(`Wrong maxAgeInSeconds=${p.maxAgeInMilliseconds}`)
        if(!p.updateFunction) throw new Error('No updateFunction')
    }

    public setUpdateFunction(updateFunctionAsync:(key:K)=>Promise<V>|V){
        this.p.updateFunction = updateFunctionAsync
    }

    public async getAsync(key:K):Promise<V>{
        let cachedVariable = this.internalMap.get(key)
        if(cachedVariable === undefined){
            cachedVariable = new CachedVariable<V>({
                maxAgeInMilliseconds: this.p.maxAgeInMilliseconds, 
                updateFunction: () => this.p.updateFunction(key), 
                useLazyUpdate: this.p.useLazyUpdate
            })
            this.internalMap.set(key, cachedVariable)
        }
        let result = await cachedVariable.getAsync()
        return result
    }


    public clearCache(){
        this.internalMap = new JsonMap<K, CachedVariable<V>>()    
    }

    public clearCacheForKey(key:K){
        const cachedVariable = this.internalMap.get(key)
        if(cachedVariable) {
            cachedVariable.clearCacheAsync()
        }
    }

}