'use strict';

const defaultCacheContext = {
    noCache: false,
    refreshInterval: 10000 // 10 seconds
};
/**
 * Provider to provide factories / services to handlers
 * @template T extends ProvidedMap the type of the map that's provided
 */
class Provider {
    Type;
    fn;
    context;
    loaded;
    refreshDate = new Date().getTime();
    constructor(fn, context = defaultCacheContext) {
        this.fn = fn;
        this.context = context;
    }
    /**
     * @returns the provided map
     */
    async provide() {
        if (!this.loaded ||
            this.context.noCache ||
            (this.context.refreshInterval > -1 && this.refreshDate < new Date().getTime())) {
            this.loaded = await this.fn();
            if (!this.context.noCache && this.context.refreshInterval > -1) {
                this.refreshDate = new Date().getTime() + this.context.refreshInterval;
            }
        }
        return this.loaded;
    }
    resetCache() {
        this.refreshDate = new Date().getTime();
    }
    /**
     * compose another provider
     * @param other the other provider
     * @returns new provider providing both the elements of this one and the other one's
     */
    and(other, context) {
        return new Provider(async () => {
            const { otherProvider, provided } = await (other instanceof Provider
                ? { otherProvider: other }
                : (async () => {
                    const provided = await this.provide();
                    return { otherProvider: other(provided), provided };
                })());
            const res = await Promise.all([provided ?? this.fn(), otherProvider.provide()]);
            return { ...res[0], ...res[1] };
        }, context ?? { noCache: true });
    }
    pick(...keys) {
        return new Provider(async () => {
            const provided = await this.provide(); // TODO have to wait anyway... how could it be enhanced ?
            return Object.entries(provided).reduce((acc, [k, v]) => {
                if (keys.includes(k)) {
                    return { ...acc, [k]: v };
                }
                else
                    return acc;
            }, {});
        });
    }
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
const provided = (p, p2, p3, p4, p5) => {
    return [p2, p3, p4, p5].reduce((acc, e) => (!!e ? acc.and(e) : acc), p);
};
const createProvider = (fn, context) => {
    const wrapped = () => Promise.resolve(fn());
    return new Provider(wrapped, context);
};
const chainProvider = (provider, fn, context) => (r) => {
    const wrapped = () => Promise.resolve(fn(r));
    return new Provider(wrapped, context);
};
const singleElementProvider = (key, elem, context) => {
    return createProvider(() => {
        const result = elem();
        return (result instanceof Promise
            ? result.then(r => ({ [key]: r }))
            : Promise.resolve({ [key]: result }));
    }, context);
};
const emptyProvider = new Provider(async () => ({}));

exports.Provider = Provider;
exports.chainProvider = chainProvider;
exports.createProvider = createProvider;
exports.defaultCacheContext = defaultCacheContext;
exports.emptyProvider = emptyProvider;
exports.provided = provided;
exports.singleElementProvider = singleElementProvider;
