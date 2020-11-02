import { CachedVariable } from "./CachedVariable";
import { JsonMap } from "@lexriver/json-map";
export declare class CachedMap<K, V> {
    protected p: {
        maxAgeInMilliseconds: number;
        updateFunction: (key: K) => Promise<V> | V;
        useLazyUpdate?: boolean;
    };
    protected internalMap: JsonMap<K, CachedVariable<V>>;
    constructor(p: {
        maxAgeInMilliseconds: number;
        updateFunction: (key: K) => Promise<V> | V;
        useLazyUpdate?: boolean;
    });
    setUpdateFunction(updateFunctionAsync: (key: K) => Promise<V>): void;
    getAsync(key: K): Promise<V>;
    clearCache(): void;
    clearCacheForKey(key: K): void;
}
