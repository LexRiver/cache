export class BoxedValue<T>{
    protected _lastModificationDate:Date = new Date()
    protected _valueContainer:{value:T}|{} = {}
    constructor(initialValue?:T){
        //this.lastDate = new Date()
        if(initialValue !== undefined){
            this._valueContainer = {value: initialValue}
        }
    }

    public get hasValue():boolean{
        //console.log('BoxedValue hasValue=', 'value' in this._valueContainer, this._valueContainer)
        return 'value' in this._valueContainer
    }

    public get isEmpty():boolean{
        return !this.hasValue
    }

    public set(value:T){
        this._valueContainer = {value}
        this._lastModificationDate = new Date()
    }

    public setByPrevious(action:(previousValue?:T)=>T){
        this.set(action(this.getOrUndefined()))
    }

    /**
     * Returns value if exists else throws error
     */
    public getOrThrow(){
        if('value' in this._valueContainer){
            return this._valueContainer.value
        }
        throw new Error('no value in BoxedValue')
    }

    /**
     * Returns value if exists else undefined
     */
    public getOrUndefined():T|undefined{
        if('value' in this._valueContainer){
            return this._valueContainer.value
        }
        return undefined
    }

    public deleteValue(){
        this._valueContainer = {}
    }

    public get lastModifactionDate(){
        return this._lastModificationDate
    }

    
}