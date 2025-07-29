import { ZodNumber, ZodDate, ZodString, ZodBoolean, ZodType, Primitive as Primitive$1, ZodObject, ZodRawShape, z, ZodError } from 'zod';
import { DeadlyError } from './errors';

type Take = {
    <T>(array: T[], n: number): T[];
    <T>(array: T[], start: number, n?: number): T[];
};
declare const take: Take;
/**
 * Create a batched array
 * @param array the original array
 * @param size the size of each chunks
 * @returns the batches
 */
declare const batch: <T>(array: T[], size: number) => T[][];
/**
 * remove duplicates from an array
 * @param array the array to check
 * @param uniqFn the function to fun on each element to know if they're unique
 * @returns array without duplicates according to the function
 */
declare const unique: <T>(array: T[], uniqFn?: (T extends object ? keyof T | ((t: T) => string) : (t: T) => string) | undefined) => T[];
/**
 * Number Aggregator on an array
 * @param op the setup for the operation
 * @param initial the initial value
 * @returns the operation ready to receive params
 */
declare const numberAggregator: (op: (n1: number, n2: number, idx: number, length: number) => number, initial?: number) => <T>(array: T[]) => T extends number ? number : (transform: (t: T) => number) => number;
/**
 * Sum an array using the Number Aggregator
 */
declare const sum: <T>(array: T[]) => T extends number ? number : (transform: (t: T) => number) => number;
/**
 * Multiply an array using the Number Aggregator
 */
declare const mul: <T>(array: T[]) => T extends number ? number : (transform: (t: T) => number) => number;
/**
 * Find the max in an array using the Number Aggregator
 */
declare const max: <T>(array: T[]) => T extends number ? number : (transform: (t: T) => number) => number;
/**
 * Find the min in an array using the Number Aggregator
 */
declare const min: <T>(array: T[]) => T extends number ? number : (transform: (t: T) => number) => number;

type ArrayRange = {
    (stop: number): number[];
    (start: number, count: number): number[];
    (start: number, count: number, step: number): number[];
};
declare const arrayRange: ArrayRange;

declare const delay: (ms: number) => Promise<unknown>;

type Class<E> = new (...args: any[]) => E;
declare const isClass: (object: any) => boolean;
declare class TypeHolder<T> {
    readonly Out: T;
}
declare const withType: <T>() => TypeHolder<T>;

/**
 * Most used HTTPMethods
 */
declare enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    HEAD = "HEAD",
    DELETE = "DELETE"
}

type Primitive = string | number | symbol;
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
declare const validate: <T>(predicate: (obj: any) => boolean) => (obj: any) => obj is T;
type Empty = null | undefined;
declare const isString: (obj: any) => obj is string;
declare const isNumber: (obj: any) => obj is number;
declare const isEmpty: (obj: any) => obj is Empty;
declare const isEmptyObject: (obj: any) => obj is {};
declare const isEmptyArray: (obj: any) => obj is [];
declare const hasCharacters: (obj: any) => obj is string;

declare const isZodNumber: (obj: any) => obj is ZodNumber;
declare const isZodDate: (obj: any) => obj is ZodDate;
declare const isZodString: (obj: any) => obj is ZodString;
declare const isZodBoolean: (obj: any) => obj is ZodBoolean;

declare const rangedRandom: (limit: number, digits?: number) => number;
declare const weighedRandom: <L extends number>(limit: L, weights: Partial<Record<IntRange<0, L>, IntRange<1, 10>>>) => IntRange<0, L>;

declare const capitalize: <S extends string>(s: S) => Capitalize<S>;
type CamelCaseKeyFromDottedKey<K extends string, hasPrefix extends boolean = false> = K extends `${infer P}.${infer S}` ? `${P}${Capitalize<CamelCaseKeyFromDottedKey<S, true>>}` : hasPrefix extends true ? Capitalize<K> : K;
declare const camelCaseDots: <S extends string>(s: S) => CamelCaseKeyFromDottedKey<S, false>;

type GenericObject = Record<Primitive, unknown>;
type Join<L extends Primitive | undefined, R extends Primitive | undefined> = L extends string | number ? R extends string | number ? `${L}.${R}` : L : R extends string | number ? R : never;
type Union<L extends unknown | undefined, R extends unknown> = L extends undefined ? R : L | R;
/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
type NestedPaths<T extends GenericObject, Prev extends Primitive | undefined = undefined> = {
    [K in keyof T]: T[K] extends GenericObject ? Union<Join<Prev, K>, NestedPaths<T[K], Join<Prev, K>>> : Union<Prev, Join<Prev, K>>;
}[keyof T];
/**
 * TypeFromPath
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
type typeFromPath<T extends GenericObject, Path extends NestedPaths<T>> = Path extends string ? {
    [K in Path]: K extends keyof T ? T[K] : K extends `${infer P}.${infer S}` ? T[P] extends GenericObject ? S extends NestedPaths<T[P]> ? typeFromPath<T[P], S> : never : never : never;
}[Path] : never;
type setTypeAtPath<T extends GenericObject, Path extends NestedPaths<T>, M> = Path extends string ? {
    [K in keyof T]: Path extends `${infer P}.${infer S}` ? T[P] extends GenericObject ? K extends P ? S extends NestedPaths<T[P]> ? setTypeAtPath<T[P], S, M> : never : T[K] : T[K] : K extends Path ? M : T[K];
} : T;
declare const merge: <O extends GenericObject, P extends NestedPaths<O, undefined>, M extends boolean | any[] | Primitive | GenericObject>(obj: O, path: P, toMerge: M | ((elem: typeFromPath<O, P>) => M)) => setTypeAtPath<O, P, M>;
declare const createMerger: <O extends GenericObject, P extends NestedPaths<O, undefined>, M extends boolean | any[] | Primitive | GenericObject>(typeHolder: TypeHolder<O>, path: P, toMerge: M | ((elem: typeFromPath<O, P>) => M)) => (o: O) => setTypeAtPath<O, P, M>;
type PickerPath<O extends GenericObject> = {
    [k in keyof O]?: O[k] extends GenericObject ? PickerPath<O[k]> | true : true;
};
type Picker<O extends GenericObject, P extends PickerPath<O>> = {
    [k in keyof P]: O[k] extends GenericObject ? P[k] extends PickerPath<O[k]> ? Picker<O[k], P[k]> : never : O[k];
};
declare const pick: <O extends GenericObject, P extends PickerPath<O>>(obj: O, picker: Readonly<P>) => Picker<O, P>;
type PickAtPathResult<O extends GenericObject, P extends {
    [k in NestedPaths<O>]?: true;
}> = {
    [k in keyof P as `${CamelCaseKeyFromDottedKey<string & k>}`]: k extends `${infer Pref}.${infer Suf}` ? O[Pref] extends GenericObject ? Suf extends NestedPaths<O[Pref]> ? typeFromPath<O[Pref], Suf> : never : never : O[k];
};
declare const pickAtPaths: <O extends GenericObject, P extends { [k in NestedPaths<O, undefined>]?: true | undefined; }>(obj: O, paths: Readonly<P>) => PickAtPathResult<O, P>;
declare const pathPicker: <O extends GenericObject, P extends { [k in NestedPaths<O, undefined>]?: true | undefined; }>(_: TypeHolder<O>, paths: Readonly<P>) => (obj: O) => PickAtPathResult<O, P>;

/**
 * Is this an existing object with at least one element
 * @param obj the tested object
 * @returns true if this is an object with at least one element false otherwise
 */
declare const objectIsNotEmpty: (obj: object | undefined) => boolean;
/**
 * Map the keys of an object
 * @param obj  the original object
 * @param fn the key mapper
 * @returns the object with the new keys
 */
declare const mapKeys: <V>(obj: Record<string, V>, fn: (k: string) => string) => Record<string, V>;
/**
 * TODO enhance
 */
type addSuffixToObject<T extends Record<string, any>, S extends string> = {
    [K in keyof T as K extends string ? `${K}${S}` : never]: T[K];
};
/**
 * Adds the prefix to a string
 */
type addPrefix<Key, Prefix extends string> = Key extends string ? `${Prefix}${Key}` : never;
/**
 * Adds the prefix to object keys
 */
type prefixedObject<P extends string, R extends Record<string, any>> = {
    [K in keyof R as addPrefix<K, P>]: R[K];
};
/**
 * add the prefix to the keys of an object
 * @param prefix the prefix
 * @param obj the object
 * @returns the object with prefixed keys
 */
declare const prefixKeys: <P extends string, R extends Record<string, any>>(prefix: P, obj: R) => prefixedObject<P, R>;
/**
 * Removes the prefix from string
 */
type removePrefix<PrefixedKey, Prefix extends string> = PrefixedKey extends addPrefix<infer Key, Prefix> ? Key : '';
/**
 * Removes the prefix from object keys
 */
type unprefixedObject<P extends string, WP extends Record<addPrefix<string, P>, any>> = {
    [k in removePrefix<keyof WP, P>]: WP[addPrefix<k, P>];
};
/**
 * Remove the prefix from the keys of an object
 * @param map the object
 * @param prefix the prefix to remove
 * @returns the unprefixed keys
 */
declare const removePrefixFromKeys: <P extends string, WP extends Record<`${P}${string}`, any>>(map: WP, prefix: P) => unprefixedObject<P, WP>;
/**
 * lowercase the keys
 */
type lowerCaseKeys<O extends Record<string, any>> = {
    [k in Lowercase<keyof O extends string ? keyof O : never>]: O[Uppercase<k>];
};
/**
 * Lowercase the keys of an object
 * @param o the object
 * @returns the lowercased object
 */
declare const lowerCaseKeys: <O extends Record<string, any>>(o: O) => lowerCaseKeys<O>;
/**
 * uppercase the keys
 */
type upperCaseKeys<O extends Record<string, any>> = {
    [k in Uppercase<keyof O extends string ? keyof O : never>]: O[Lowercase<k>];
};
/**
 * Uppercase the keys of an object
 * @param o the object
 * @returns the uppercased object
 */
declare const upperCaseKeys: <O extends Record<string, any>>(o: O) => upperCaseKeys<O>;
/**
 * Remove keys from an object
 * @param obj the object
 * @param keys the keys to omit
 */
declare const omit: <O extends Record<string, any>, K extends keyof O>(obj: O, ...keys: readonly K[]) => Omit<O, K>;
/**
 * Map the values of an object while keeping its structure
 * @param object the original object
 * @param fn the mapper
 * @returns the object with mapped values
 */
declare const mapValues: <M extends Record<string, any>, U>(object: M, fn: (value: M[keyof M]) => U) => Record<keyof M, U>;
/**
 * group the objects by one of their keys
 * @param objects the objects
 * @param k the key to group on
 * @returns the grouped objects
 */
declare const groupByKey: <O extends Record<any, any>, K extends keyof O>(objects: O[], k: K) => Record<O[K], O[]>;
/**
 * group the objects by one of their keys as unique id
 * @param objects the objects
 * @param k the key to group on
 * @returns the grouped objects
 */
declare const groupById: <O extends Record<any, any>, K extends keyof O>(objects: O[], k: K) => Record<O[K], Omit<O, K>>;

type PrimitiveZodType = ZodType<Primitive$1>;
declare const flattenZodSchema: (schema: ZodObject<ZodRawShape>) => Record<string, PrimitiveZodType>;
declare const toProjection: <ZO extends z.ZodObject<any, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>>(obj: ZO) => Record<keyof z.TypeOf<ZO>, 1>;

type primitive = number | string | boolean;
type Interpolator = {
    [k: string]: Interpolator | primitive | Error;
};
type InterpolatorMatcher = [string, string];
/**
 *
 * @param str the string to interpolate into
 * @param interpolator the interpolator object
 * @returns the interpolated string
 */
declare const interpolate: (str: string, interpolator: Interpolator | primitive, matcher?: InterpolatorMatcher) => string;
declare const validateStringAgainstInterpolatorKeys: (str: string, keys: string[], matcher?: InterpolatorMatcher) => void;
/**
 * Will replace the different matcher elements in the string
 * matchers will look like this: [id] and can contain anything textual within the brackets
 * @param str the string to replace parts in
 * @param replacements the ordered replacements
 * @returns the modified string
 */
declare const replaceInOrder: (str: string, ...replacements: string[]) => string;

declare class ConfigError extends DeadlyError {
}
declare class ConfigMissingKeyError extends ConfigError {
    readonly key: string;
    constructor(key: string);
}
declare class ConfigParseError extends Error {
    readonly e: ZodError;
    constructor(e: ZodError);
}
declare class ApplicationSetupError extends Error {
    readonly element: string;
    readonly configKey?: string;
    constructor(element: string, configKey?: string);
}

type ConfigResult<T> = ConfigSuccess<T> | ConfigFailure;
interface ConfigSuccess<V> {
    success: true;
    value: V;
}
interface ConfigFailure {
    success: false;
    error: ConfigError;
}
type FlatShape = Record<string, Primitive$1>;
type ZodFlatShape<S extends FlatShape = FlatShape> = {
    [k in keyof S]: ZodType<S[k]>;
};
type HasConfigKey<K extends string, V extends Primitive$1> = FlatShape & {
    [k in K]: V;
};
/**
 *
 * @returns process.env as a map of string:string
 */
declare const parseProcessEnvAsMap: (keepKeys: string[]) => {
    [k: string]: string;
};
/**
 * coerce all the fields in a schema
 * @param typ the schema to coerce
 * @returns the schema that will work against string:string map
 */
declare const coerceSchema: <T extends FlatShape>(typ: z.ZodObject<ZodFlatShape<T>, any, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<ZodFlatShape<T>>, (z.baseObjectOutputType<ZodFlatShape<T>> extends infer T_2 extends object ? { [k_1 in keyof T_2]: undefined extends z.baseObjectOutputType<ZodFlatShape<T>>[k_1] ? never : k_1; } : never)[keyof T]> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<ZodFlatShape<T>>, (z.baseObjectOutputType<ZodFlatShape<T>> extends infer T_2 extends object ? { [k_1 in keyof T_2]: undefined extends z.baseObjectOutputType<ZodFlatShape<T>>[k_1] ? never : k_1; } : never)[keyof T]>[k]; } : never, z.baseObjectInputType<ZodFlatShape<T>> extends infer T_3 ? { [k_2 in keyof T_3]: z.baseObjectInputType<ZodFlatShape<T>>[k_2]; } : never>) => z.ZodObject<ZodFlatShape<T>, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<ZodFlatShape<T>>, (z.baseObjectOutputType<ZodFlatShape<T>> extends infer T_2 extends object ? { [k_1 in keyof T_2]: undefined extends z.baseObjectOutputType<ZodFlatShape<T>>[k_1] ? never : k_1; } : never)[keyof T]> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<ZodFlatShape<T>>, (z.baseObjectOutputType<ZodFlatShape<T>> extends infer T_2 extends object ? { [k_1 in keyof T_2]: undefined extends z.baseObjectOutputType<ZodFlatShape<T>>[k_1] ? never : k_1; } : never)[keyof T]>[k]; } : never, z.baseObjectInputType<ZodFlatShape<T>> extends infer T_3 ? { [k_2 in keyof T_3]: z.baseObjectInputType<ZodFlatShape<T>>[k_2]; } : never>;
/**
 * coerces a type ("12") -> 12
 * @param typ the type to coerce
 * @returns the coerced type
 */
declare const coerceType: <T extends Primitive$1>(typ: z.ZodType<T, z.ZodTypeDef, T>) => z.ZodType<T, z.ZodTypeDef, T>;
declare const NodeEnvConfig: z.ZodObject<{
    NODE_ENV: z.ZodUnion<[z.ZodLiteral<"production">, z.ZodLiteral<"development">, z.ZodLiteral<"test">]>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "production" | "development" | "test";
}, {
    NODE_ENV: "production" | "development" | "test";
}>;
type NodeEnvConfig = z.infer<typeof NodeEnvConfig>;
type confObject<C extends Configuration<any>> = C['Config'];
/**
 * Configuration
 *
 * Strongly typed, typesafe, validated by zod configuration (process.env) with extra functions
 */
declare class Configuration<T extends FlatShape> {
    readonly Config: lowerCaseKeys<T>;
    protected rawConfig: Record<string, string>;
    private parsed?;
    readonly schema: ZodObject<ZodFlatShape<T>, 'passthrough'>;
    constructor(schema: ZodObject<ZodFlatShape<T>>, object?: Record<keyof T, string>);
    validate(): void;
    get asObject(): lowerCaseKeys<T>;
    aliased<A extends Record<string, keyof lowerCaseKeys<T>>>(aliases: A): {
        [k in keyof A]: T[A[k]];
    };
    get<K extends keyof T>(key: K, defaultValue?: T[K]): T[K];
    safeGet<K extends keyof T>(key: K): ConfigResult<T[K]>;
    extend<C extends FlatShape>(other: Configuration<C> | ZodFlatShape<C>): Configuration<C & T>;
}
declare class EnvConfiguration<T extends FlatShape> extends Configuration<T & NodeEnvConfig> {
    constructor(parser: ZodObject<ZodFlatShape<T>>);
    get isProduction(): boolean;
    get isTest(): boolean;
    get isDevelopment(): boolean;
}
declare const buildEnvConfig: <T extends FlatShape>(parser: z.ZodObject<ZodFlatShape<T>, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<ZodFlatShape<T>>, (z.baseObjectOutputType<ZodFlatShape<T>> extends infer T_2 extends object ? { [k_1 in keyof T_2]: undefined extends z.baseObjectOutputType<ZodFlatShape<T>>[k_1] ? never : k_1; } : never)[keyof T]> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<ZodFlatShape<T>>, (z.baseObjectOutputType<ZodFlatShape<T>> extends infer T_2 extends object ? { [k_1 in keyof T_2]: undefined extends z.baseObjectOutputType<ZodFlatShape<T>>[k_1] ? never : k_1; } : never)[keyof T]>[k]; } : never, z.baseObjectInputType<ZodFlatShape<T>> extends infer T_3 ? { [k_2 in keyof T_3]: z.baseObjectInputType<ZodFlatShape<T>>[k_2]; } : never>) => EnvConfiguration<T>;
declare const buildConfig: <T extends FlatShape>(parser: z.ZodObject<ZodFlatShape<T>, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<ZodFlatShape<T>>, (z.baseObjectOutputType<ZodFlatShape<T>> extends infer T_2 extends object ? { [k_1 in keyof T_2]: undefined extends z.baseObjectOutputType<ZodFlatShape<T>>[k_1] ? never : k_1; } : never)[keyof T]> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<ZodFlatShape<T>>, (z.baseObjectOutputType<ZodFlatShape<T>> extends infer T_2 extends object ? { [k_1 in keyof T_2]: undefined extends z.baseObjectOutputType<ZodFlatShape<T>>[k_1] ? never : k_1; } : never)[keyof T]>[k]; } : never, z.baseObjectInputType<ZodFlatShape<T>> extends infer T_3 ? { [k_2 in keyof T_3]: z.baseObjectInputType<ZodFlatShape<T>>[k_2]; } : never>) => Configuration<T>;

export { ApplicationSetupError, ArrayRange, CamelCaseKeyFromDottedKey, Class, ConfigError, ConfigFailure, ConfigMissingKeyError, ConfigParseError, ConfigResult, ConfigSuccess, Configuration, Empty, Enumerate, EnvConfiguration, FlatShape, GenericObject, HTTPMethod, HasConfigKey, IntRange, NestedPaths, PickAtPathResult, Picker, PickerPath, Primitive, PrimitiveZodType, Take, TypeHolder, ZodFlatShape, addPrefix, addSuffixToObject, arrayRange, batch, buildConfig, buildEnvConfig, camelCaseDots, capitalize, coerceSchema, coerceType, confObject, createMerger, delay, flattenZodSchema, groupById, groupByKey, hasCharacters, interpolate, isClass, isEmpty, isEmptyArray, isEmptyObject, isNumber, isString, isZodBoolean, isZodDate, isZodNumber, isZodString, lowerCaseKeys, mapKeys, mapValues, max, merge, min, mul, numberAggregator, objectIsNotEmpty, omit, parseProcessEnvAsMap, pathPicker, pick, pickAtPaths, prefixKeys, prefixedObject, rangedRandom, removePrefix, removePrefixFromKeys, replaceInOrder, setTypeAtPath, sum, take, toProjection, typeFromPath, unique, unprefixedObject, upperCaseKeys, validate, validateStringAgainstInterpolatorKeys, weighedRandom, withType };
