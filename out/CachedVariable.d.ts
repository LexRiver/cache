import { TypeEvent } from "@lexriver/type-event";
import { BoxedValue } from "./BoxedValue";
/**
 * Returns cached value if available.
 * Cached value becomes undefined by timer after assign.
 * On `get` request it will be async updated if not assign
 */
export declare class CachedVariable<T> {
    protected p: {
        maxAgeInMilliseconds: number;
        updateFunction: (prevValue?: T) => Promise<T> | T;
        initialValue?: T;
        useLazyUpdate?: boolean;
    };
    onDisposeEvent: TypeEvent<() => void>;
    protected timer: any;
    protected valueB: BoxedValue<T>;
    constructor(p: {
        maxAgeInMilliseconds: number;
        updateFunction: (prevValue?: T) => Promise<T> | T;
        initialValue?: T;
        useLazyUpdate?: boolean;
    });
    protected startUpdateByTimer(): Promise<void>;
    setUpdateFunction(updateFunctionAsync: (prevValue?: T) => Promise<T> | T): void;
    /**
     * returns cached value if possible or executes updateFunctionAsync to get a new value
     */
    getAsync(): Promise<T>;
    protected waitForUpdate(): Promise<void>;
    protected isUpdatingNow: boolean;
    protected updateAsync(): Promise<void>;
    updateWithValueAsync(value: T): Promise<void>;
    /**
     * clears cache and load new value (if not lazyUpdate)
     */
    clearCacheAsync(): Promise<void>;
    protected disposeValueByTimer(): void;
    get hasValue(): boolean;
}
