'use strict';

var zod = require('zod');
var errors = require('./errors');
var logs = require('./logs');

const take = (array, param, n) => {
    const start = typeof n === 'number' ? param : 0;
    const count = typeof n === 'number' ? start + n : param;
    return array.slice(start, count);
};
/**
 * Create a batched array
 * @param array the original array
 * @param size the size of each chunks
 * @returns the batches
 */
const batch = (array, size) => {
    return array.reduce((acc, i) => {
        if (acc.length === 0)
            return [[i]];
        const lastBatch = acc[acc.length - 1];
        if (lastBatch.length >= size)
            return [...acc, [i]];
        else {
            const untilLastBatch = acc.length - 1;
            return [...take(acc, untilLastBatch), [...lastBatch, i]];
        }
    }, []);
};
/**
 * remove duplicates from an array
 * @param array the array to check
 * @param uniqFn the function to fun on each element to know if they're unique
 * @returns array without duplicates according to the function
 */
const unique = (array, uniqFn) => {
    const valueTransformer = typeof uniqFn === 'string'
        ? (t) => t[uniqFn]
        : typeof uniqFn === 'function'
            ? uniqFn
            : (t) => t;
    return array.reduce((acc, e) => {
        return acc.find(previousElement => valueTransformer(previousElement) === valueTransformer(e))
            ? acc
            : [...acc, e];
    }, []);
};
/**
 * Number Aggregator on an array
 * @param op the setup for the operation
 * @param initial the initial value
 * @returns the operation ready to receive params
 */
const numberAggregator = (op, initial) => (array) => {
    if (array.length === 0)
        return (initial ?? 0);
    else if (typeof array[0] === 'number')
        return array.reduce((acc, e, i, arr) => (acc ? op(acc, e, i, arr.length) : e), initial);
    else
        return ((transform) => array.reduce((acc, e, i, arr) => (acc ? op(acc, transform(e), i, arr.length) : transform(e)), initial));
};
/**
 * Sum an array using the Number Aggregator
 */
const sum = numberAggregator((n1, n2) => n1 + n2, 0);
/**
 * Multiply an array using the Number Aggregator
 */
const mul = numberAggregator((n1, n2) => n1 * n2, 1);
/**
 * Find the max in an array using the Number Aggregator
 */
const max = numberAggregator((n1, n2) => (n1 > n2 ? n1 : n2));
/**
 * Find the min in an array using the Number Aggregator
 */
const min = numberAggregator((n1, n2) => (n1 < n2 ? n1 : n2));

const arrayRange = (param, count, step = 1) => {
    if (step === 0)
        throw new Error('No 0 step allowed');
    const length = count ? count - param : param;
    const start = count ? param : 0;
    return Array.from({ length: length / Math.abs(step) }, (value, index) => start + index * step);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const rangedRandom = (limit, digits = 0) => {
    return +(Math.round(Math.random() * limit + `e+${digits}`) + `e-${digits}`);
};
const weighedRandom = (limit, weights) => {
    const weightedArray = arrayRange(limit).reduce((acc, index) => [
        ...acc,
        ...(weights[index]
            ? arrayRange(weights[index]).map(_ => index)
            : [index])
    ], []);
    return weightedArray[rangedRandom(weightedArray.length - 1)];
};

const capitalize = (s) => s.split('').reduce((acc, e) => (!acc ? e.toUpperCase() : `${acc}${e}`), '');
const camelCaseDots = (s) => s
    .split('.')
    .reduce((acc, e) => (!acc ? e : `${acc}${capitalize(e)}`), '');

// thanks a lot https://javascript.plainenglish.io/advanced-typescript-type-level-nested-object-paths-7f3d8901f29a
const merge = (obj, path, toMerge) => {
    const [head, ...parts] = path.split('.');
    if (parts.length === 0) {
        return {
            ...obj,
            [head]: typeof toMerge === 'function' ? toMerge(obj[head]) : toMerge
        };
    }
    else {
        if (typeof obj[head] !== 'object') {
            throw new Error(`Cannot merge ${path} into ${obj}`);
        }
        return {
            ...obj,
            [head]: merge(obj[head], parts.join('.'), toMerge)
        };
    }
};
const createMerger = (typeHolder, path, toMerge) => {
    return (o) => merge(o, path, toMerge);
};
const pick = (obj, picker) => {
    return Object.entries(picker).reduce((acc, [k, v]) => typeof v === 'object'
        ? { ...acc, [k]: pick(obj[k], v) }
        : { ...acc, [k]: obj[k] }, {});
};
const pickAtPath = (obj, path) => {
    const result = path
        .toString()
        .split('.')
        .reduce((acc, p) => acc[p] ?? {}, obj);
    return result;
};
const pickAtPaths = (obj, paths) => {
    return Object.keys(paths).reduce((acc, p) => ({ ...acc, [camelCaseDots(p)]: pickAtPath(obj, p) }), {});
};
const pathPicker = (_, paths) => {
    return obj => pickAtPaths(obj, paths);
};

/**
 * Is this an existing object with at least one element
 * @param obj the tested object
 * @returns true if this is an object with at least one element false otherwise
 */
const objectIsNotEmpty = (obj) => {
    return typeof obj === 'object' && Object.keys(obj).length > 0;
};
/**
 * Map the keys of an object
 * @param obj  the original object
 * @param fn the key mapper
 * @returns the object with the new keys
 */
const mapKeys = (obj, fn) => {
    return Object.entries(obj).reduce((acc, [k, v]) => ({ ...acc, [fn(k)]: v }), {});
};
/**
 * add the prefix to the keys of an object
 * @param prefix the prefix
 * @param obj the object
 * @returns the object with prefixed keys
 */
const prefixKeys = (prefix, obj) => {
    return mapKeys(obj, s => `${prefix}${s}`);
};
/**
 * Remove the prefix from the keys of an object
 * @param map the object
 * @param prefix the prefix to remove
 * @returns the unprefixed keys
 */
const removePrefixFromKeys = (map, prefix) => {
    return Object.entries(map).reduce((acc, [k, v]) => ({ ...acc, [k.startsWith(prefix) ? k.substring(prefix.length) : k]: v }), {});
};
/**
 * Lowercase the keys of an object
 * @param o the object
 * @returns the lowercased object
 */
const lowerCaseKeys = (o) => {
    return Object.entries(o).reduce((acc, [k, v]) => ({ ...acc, [k.toLocaleLowerCase()]: v }), {});
};
/**
 * Uppercase the keys of an object
 * @param o the object
 * @returns the uppercased object
 */
const upperCaseKeys = (o) => {
    return Object.entries(o).reduce((acc, [k, v]) => ({ ...acc, [k.toLocaleUpperCase()]: v }), {});
};
/**
 * Remove keys from an object
 * @param obj the object
 * @param keys the keys to omit
 */
const omit = (obj, ...keys) => {
    return Object.entries(obj).reduce((acc, [k, v]) => keys.includes(k)
        ? acc
        : {
            ...acc,
            [k]: v
        }, {});
};
/**
 * Map the values of an object while keeping its structure
 * @param object the original object
 * @param fn the mapper
 * @returns the object with mapped values
 */
const mapValues = (object, fn) => {
    return Object.entries(object).reduce((acc, [k, v]) => ({ ...acc, [k]: fn(v) }), {});
};
/**
 * group the objects by one of their keys
 * @param objects the objects
 * @param k the key to group on
 * @returns the grouped objects
 */
const groupByKey = (objects, k) => {
    return objects.reduce((acc, o) => ({
        ...acc,
        [o[k]]: [...(acc[o[k]] ?? []), o]
    }), {});
};
/**
 * group the objects by one of their keys as unique id
 * @param objects the objects
 * @param k the key to group on
 * @returns the grouped objects
 */
const groupById = (objects, k) => {
    return objects.reduce((acc, o) => ({
        ...acc,
        [o[k]]: omit(o, k)
    }), {});
};

const flattenZodSchema = (schema) => {
    return Object.keys(schema.keyof().Values).reduce((acc, k) => {
        const ztype = schema.shape[k];
        if (typeof ztype.shape === 'object') {
            const flattened = flattenZodSchema(ztype);
            return { ...acc, ...mapKeys(flattened, subKey => `${k}.${subKey}`) };
        }
        else {
            return { ...acc, [k]: ztype };
        }
    }, {});
};
const toProjection = (obj) => {
    return Object.keys(obj._def.shape()).reduce((acc, k) => ({ ...acc, [k]: 1 }), {});
};

const stripMatcher = (str, matcher) => str.replace(new RegExp(matcher[0]), '').replace(new RegExp(matcher[1]), '');
/**
 *
 * @param str the string to interpolate into
 * @param interpolator the interpolator object
 * @returns the interpolated string
 */
const interpolate = (str, interpolator, matcher = ['\\${', '}']) => {
    return str.replace(new RegExp(`${matcher[0]}.*?${matcher[1]}`, 'g'), g => {
        if (typeof interpolator !== 'object')
            return interpolator + '';
        const replacer = stripMatcher(g, matcher);
        const nest = replacer.split('.');
        let obj = interpolator;
        for (let i = 0; i < nest.length; i++) {
            const key = nest[i];
            const nested = obj?.[key];
            if (['string', 'number'].includes(typeof nested) && i === nest.length - 1) {
                return (nested + '');
            }
            else if (typeof nested === 'object') {
                obj = nested;
            }
            else {
                return g;
            }
        }
        return g;
    });
};
const validateStringAgainstInterpolatorKeys = (str, keys, matcher = ['\\${', '}']) => {
    const result = str.match(new RegExp(`${matcher[0]}.*?${matcher[1]}`, 'g'));
    if (!result)
        return;
    const missingKeys = result.reduce((acc, g) => {
        const replacer = stripMatcher(g, matcher);
        return !keys.includes(replacer) ? [...acc, replacer] : acc;
    }, []);
    if (missingKeys.length > 0)
        throw new Error(`Cannot validate ${str} against provider keys definition: ${keys}, missing keys: ${missingKeys.join(', ')}`);
    return;
};
/**
 * Will replace the different matcher elements in the string
 * matchers will look like this: [id] and can contain anything textual within the brackets
 * @param str the string to replace parts in
 * @param replacements the ordered replacements
 * @returns the modified string
 */
const replaceInOrder = (str, ...replacements) => {
    let i = 0;
    return str.replace(/\[.*?\]/g, g => {
        return replacements[i++] ?? g;
    });
};

const isClass = (object) => {
    const propertyNames = Object.getOwnPropertyNames(object);
    return (typeof object === 'function' &&
        propertyNames.includes('prototype') &&
        !propertyNames.includes('arguments') &&
        object?.toString?.().startsWith('class'));
};
class TypeHolder {
    Out;
}
const withType = () => {
    return new TypeHolder();
};

/**
 * Most used HTTPMethods
 */
exports.HTTPMethod = void 0;
(function (HTTPMethod) {
    HTTPMethod["GET"] = "GET";
    HTTPMethod["POST"] = "POST";
    HTTPMethod["PUT"] = "PUT";
    HTTPMethod["HEAD"] = "HEAD";
    HTTPMethod["DELETE"] = "DELETE";
})(exports.HTTPMethod || (exports.HTTPMethod = {}));

const validate = (predicate) => (obj) => {
    return predicate(obj);
};
const isString = validate(s => typeof s === 'string');
const isNumber = validate(n => typeof n === 'number');
const isEmpty = validate(o => typeof o === 'undefined' || o === null);
const isEmptyObject = validate(o => typeof o === 'object' && Object.getOwnPropertyNames(o).length === 0);
const isEmptyArray = validate(o => Array.isArray(o) && o.length === 0);
const hasCharacters = validate(o => isString(o) && o.trim() !== '');

const isZodNumber = validate(o => typeof o === 'object' && o._def?.typeName === 'ZodNumber');
const isZodDate = validate(o => typeof o === 'object' && o._def?.typeName === 'ZodDate');
const isZodString = validate(o => typeof o === 'object' && o._def?.typeName === 'ZodString');
const isZodBoolean = validate(o => typeof o === 'object' && o._def?.typeName === 'ZodBoolean');

class ConfigError extends errors.DeadlyError {
}
class ConfigMissingKeyError extends ConfigError {
    key;
    constructor(key) {
        super('Missing key in config: ' + key);
        this.key = key;
    }
}
class ConfigParseError extends Error {
    e;
    constructor(e) {
        super('Cannot parse config: ' + e.message);
        this.e = e;
    }
}
class ApplicationSetupError extends Error {
    element;
    configKey;
    constructor(element, configKey) {
        super(`couldn't setup application's ${element}${configKey ? `: key ${configKey} was missing` : ''}`);
        this.element = element;
        this.configKey = configKey;
    }
}

const logger = logs.UtilsLoggingContext.getLogger('configuration');
const configSuccess = (value) => ({
    success: true,
    value
});
const configError = (error) => ({
    success: false,
    error
});
/**
 *
 * @returns process.env as a map of string:string
 */
const parseProcessEnvAsMap = (keepKeys) => {
    return keepKeys.reduce((acc, k) => {
        const value = process.env[k];
        if (!value)
            logger.warn("couldn't find: %s in process.env", k);
        else {
            logger.debug('found [%s]: %s', k, value);
        }
        return { ...acc, [k]: value };
    }, {});
};
/**
 * coerce all the fields in a schema
 * @param typ the schema to coerce
 * @returns the schema that will work against string:string map
 */
const coerceSchema = (typ) => {
    Object.keys(typ.keyof().Values).forEach(k => coerceType(typ.shape[k]));
    return typ;
};
/**
 * coerces a type ("12") -> 12
 * @param typ the type to coerce
 * @returns the coerced type
 */
const coerceType = (typ) => {
    if (Object.hasOwn(typ?._def, 'coerce')) {
        typ._def['coerce'] = true;
    }
    return typ;
};
const NodeEnvConfig = zod.z.object({
    NODE_ENV: zod.z.union([zod.z.literal('production'), zod.z.literal('development'), zod.z.literal('test')])
});
/**
 * Configuration
 *
 * Strongly typed, typesafe, validated by zod configuration (process.env) with extra functions
 */
class Configuration {
    Config;
    rawConfig;
    parsed;
    schema;
    constructor(schema, object) {
        this.schema = schema.passthrough();
        const keys = Object.keys(schema.shape);
        this.rawConfig = object ?? parseProcessEnvAsMap(keys);
    }
    validate() {
        try {
            this.parsed = lowerCaseKeys(coerceSchema(this.schema).parse(this.rawConfig));
        }
        catch (e) {
            throw new ConfigParseError(e);
        }
    }
    get asObject() {
        if (!this.parsed) {
            this.validate();
        }
        return this.parsed;
    }
    aliased(aliases) {
        return Object.entries(aliases).reduce((acc, [alias, key]) => ({
            ...acc,
            [alias]: this.asObject[key]
        }), {});
    }
    get(key, defaultValue) {
        const result = this.safeGet(key);
        if (result.success)
            return result.value;
        if (typeof defaultValue !== 'undefined') {
            return defaultValue;
        }
        else {
            throw result.error;
        }
    }
    safeGet(key) {
        if (!this.rawConfig[key]) {
            return configError(new ConfigMissingKeyError(key));
        }
        const result = coerceType(this.schema.shape[key]).safeParse(this.rawConfig[key]);
        if (result.success) {
            return configSuccess(result.data);
        }
        else {
            return configError(result.error);
        }
    }
    extend(other) {
        const otherConfig = other instanceof Configuration ? other : new Configuration(zod.z.object(other));
        return new Configuration(this.schema.merge(otherConfig.schema), {
            ...this.rawConfig,
            ...otherConfig.rawConfig
        });
    }
}
class EnvConfiguration extends Configuration {
    constructor(parser) {
        super(NodeEnvConfig.merge(parser));
    }
    get isProduction() {
        const result = this.safeGet('NODE_ENV');
        return result.success && result.value === 'production';
    }
    get isTest() {
        const result = this.safeGet('NODE_ENV');
        return result.success && result.value === 'test';
    }
    get isDevelopment() {
        const result = this.safeGet('NODE_ENV');
        return result.success && result.value === 'development';
    }
}
const buildEnvConfig = (parser) => {
    return new EnvConfiguration(parser);
};
const buildConfig = (parser) => {
    return new Configuration(parser);
};

exports.ApplicationSetupError = ApplicationSetupError;
exports.ConfigError = ConfigError;
exports.ConfigMissingKeyError = ConfigMissingKeyError;
exports.ConfigParseError = ConfigParseError;
exports.Configuration = Configuration;
exports.EnvConfiguration = EnvConfiguration;
exports.TypeHolder = TypeHolder;
exports.arrayRange = arrayRange;
exports.batch = batch;
exports.buildConfig = buildConfig;
exports.buildEnvConfig = buildEnvConfig;
exports.camelCaseDots = camelCaseDots;
exports.capitalize = capitalize;
exports.coerceSchema = coerceSchema;
exports.coerceType = coerceType;
exports.createMerger = createMerger;
exports.delay = delay;
exports.flattenZodSchema = flattenZodSchema;
exports.groupById = groupById;
exports.groupByKey = groupByKey;
exports.hasCharacters = hasCharacters;
exports.interpolate = interpolate;
exports.isClass = isClass;
exports.isEmpty = isEmpty;
exports.isEmptyArray = isEmptyArray;
exports.isEmptyObject = isEmptyObject;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isZodBoolean = isZodBoolean;
exports.isZodDate = isZodDate;
exports.isZodNumber = isZodNumber;
exports.isZodString = isZodString;
exports.lowerCaseKeys = lowerCaseKeys;
exports.mapKeys = mapKeys;
exports.mapValues = mapValues;
exports.max = max;
exports.merge = merge;
exports.min = min;
exports.mul = mul;
exports.numberAggregator = numberAggregator;
exports.objectIsNotEmpty = objectIsNotEmpty;
exports.omit = omit;
exports.parseProcessEnvAsMap = parseProcessEnvAsMap;
exports.pathPicker = pathPicker;
exports.pick = pick;
exports.pickAtPaths = pickAtPaths;
exports.prefixKeys = prefixKeys;
exports.rangedRandom = rangedRandom;
exports.removePrefixFromKeys = removePrefixFromKeys;
exports.replaceInOrder = replaceInOrder;
exports.sum = sum;
exports.take = take;
exports.toProjection = toProjection;
exports.unique = unique;
exports.upperCaseKeys = upperCaseKeys;
exports.validate = validate;
exports.validateStringAgainstInterpolatorKeys = validateStringAgainstInterpolatorKeys;
exports.weighedRandom = weighedRandom;
exports.withType = withType;
