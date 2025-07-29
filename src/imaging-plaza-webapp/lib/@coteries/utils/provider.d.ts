type ProvidedMap = {
    [k: string]: any;
};
/**
 * CacheContext for the provider
 * refreshInterval -1 = never refresh
 */
type CacheContext = {
    noCache: true;
} | {
    noCache: false;
    refreshInterval: number;
};
declare const defaultCacheContext: CacheContext;
/**
 * Provider to provide factories / services to handlers
 * @template T extends ProvidedMap the type of the map that's provided
 */
declare class Provider<T extends ProvidedMap> {
    readonly Type: T;
    private fn;
    private context;
    loaded?: T;
    private refreshDate;
    constructor(fn: () => Promise<T>, context?: CacheContext);
    /**
     * @returns the provided map
     */
    provide(): Promise<T>;
    resetCache(): void;
    /**
     * compose another provider
     * @param other the other provider
     * @returns new provider providing both the elements of this one and the other one's
     */
    and<U extends ProvidedMap>(other: Provider<U> | ((t: T) => Provider<U>), context?: CacheContext): Provider<T & U>;
    pick<S extends keyof T>(...keys: S[]): Provider<Pick<T, S>>;
}
/**
 * Creates a new provider with all the providers passed (up to 5 because why not)
 * @param fn first provider
 * @param fn2 second provider
 * @param fn3 third provider
 * @param fn4 fourth provider
 * @param fn5 fifth provider
 * @returns Provider composed of all the provided elements in the providers
 */
declare const provided: <T extends ProvidedMap, U extends ProvidedMap = {}, V extends ProvidedMap = {}, W extends ProvidedMap = {}, X extends ProvidedMap = {}>(p: Provider<T>, p2?: Provider<U> | undefined, p3?: Provider<V> | undefined, p4?: Provider<W> | undefined, p5?: Provider<X> | undefined) => Provider<T & U & V & W & X>;
declare const createProvider: <T extends ProvidedMap>(fn: () => T | Promise<T>, context?: CacheContext) => Provider<Awaited<T> | Awaited<T>>;
declare const chainProvider: <T extends ProvidedMap, R extends Provider<any>>(provider: R, fn: (r: R["Type"]) => T | Promise<T>, context?: CacheContext) => (r: R["Type"]) => Provider<Awaited<T> | Awaited<T>>;
declare const singleElementProvider: <K extends string, P>(key: K, elem: () => P | Promise<P>, context?: CacheContext) => Provider<Awaited<{ [k in K]: P; }>>;
declare const emptyProvider: Provider<{}>;

export { CacheContext, ProvidedMap, Provider, chainProvider, createProvider, defaultCacheContext, emptyProvider, provided, singleElementProvider };
