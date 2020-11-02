export declare class BoxedValue<T> {
    protected _lastModificationDate: Date;
    protected _valueContainer: {
        value: T;
    } | {};
    constructor(initialValue?: T);
    get hasValue(): boolean;
    get isEmpty(): boolean;
    set(value: T): void;
    setByPrevious(action: (previousValue?: T) => T): void;
    /**
     * Returns value if exists else throws error
     */
    getOrThrow(): T;
    /**
     * Returns value if exists else undefined
     */
    getOrUndefined(): T | undefined;
    deleteValue(): void;
    get lastModifactionDate(): Date;
}
