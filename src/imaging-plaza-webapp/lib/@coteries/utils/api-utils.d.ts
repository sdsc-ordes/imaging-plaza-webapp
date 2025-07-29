import { ZodType } from 'zod';

declare const stripLeadingSlash: (part: string) => string;
declare const stripEndingSlash: (part: string) => string;
/**
 * Remove leading and trailing slashes
 * @param part the url part
 * @returns the sanitized url
 */
declare const sanitzeURLPart: (part: string) => string;
/**
 * Build an url by appending parts to a base uri
 * @param base the base for the final url
 * @param parts all the parts to append to the url
 * @returns the built URL
 */
declare const buildUrl: (base: string, ...parts: string[]) => string;
type slugged<S extends Record<string, true>> = Record<keyof S, string>;
type sluggedURL<Params extends Record<string, true>> = (slug: slugged<Params>) => string;
/**
 * prepare a url for interpolation
 * @param urlString the url to interpolate
 * @param _ the slug representation
 * @returns
 */
declare const dynamicUrl: <Params extends Record<string, true>>(urlString: string, _?: Params | undefined) => sluggedURL<Params>;

declare class FetchError extends Error {
    readonly status: number;
    readonly url: string;
    constructor(status: number, url: string, method: string);
}
type TypedFetchOptions<T> = RequestInit & {
    parser?: ZodType<T>;
    rawResponseKeeper?: {
        response?: Response;
    };
};
declare const typedFetch: <T>(url: string, options?: TypedFetchOptions<T> | undefined) => Promise<T>;
declare class TypedFetch<Params extends Record<string, true>> {
    readonly url: string;
    private constructor();
    get<T>(params: slugged<Params>, options?: TypedFetchOptions<T>): Promise<T>;
    put<T, U = T>(params: slugged<Params>, body: Partial<U>, options?: TypedFetchOptions<T>): Promise<T>;
    post<T, U = T>(params: slugged<Params>, body: U, options?: TypedFetchOptions<T>): Promise<T>;
    delete<T = any>(params: slugged<Params>, options?: TypedFetchOptions<T>): Promise<T>;
    postFiles<T = any>(params: slugged<Params>, files: File[], options?: RequestInit & {
        parser?: ZodType<T>;
    }): Promise<T>;
    static prepare: <Params_1 extends Record<string, true>>(url: string, _?: Params_1 | undefined) => TypedFetch<Params_1>;
    static get: <T>(url: string, options?: TypedFetchOptions<T> | undefined) => Promise<T>;
    static put: <T, U = T>(url: string, body: Partial<U>, options?: TypedFetchOptions<T> | undefined) => Promise<T>;
    static post: <T, U = T>(url: string, body: U, options?: TypedFetchOptions<T> | undefined) => Promise<T>;
    static delete: <T = any>(url: string, options?: TypedFetchOptions<T> | undefined) => Promise<T>;
    static postFiles<T = any>(url: string, files: File[], options?: RequestInit & {
        parser?: ZodType<T>;
    }): Promise<T>;
}

export { FetchError, TypedFetch, buildUrl, dynamicUrl, sanitzeURLPart, slugged, sluggedURL, stripEndingSlash, stripLeadingSlash, typedFetch };
