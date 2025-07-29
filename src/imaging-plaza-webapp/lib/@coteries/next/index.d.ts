import { NextApiRequest, NextApiResponse } from 'next';
import * as zod from 'zod';
import { ZodError, ZodType } from 'zod';
import { ErrorHandler } from '@coteries/utils/errors';
import { ProvidedMap, Provider } from '@coteries/utils/provider';
import { FlatShape, lowerCaseKeys, Configuration } from '@coteries/utils';
import { NextRequest } from 'next/server';
import * as _coteries_utils_logs from '@coteries/utils/logs';

declare class UnauthorizedError extends Error {
    constructor();
}
declare class SessionExpiredError extends Error {
    constructor();
}
declare class ForbiddenError extends Error {
    constructor();
}

type StatusWithPayload = {
    status: number;
    payload: Record<string, any>;
};
type NextErrorHandler = ErrorHandler<StatusWithPayload>;
/**
 * Bad structure error handler (based on Zod validation)
 */
declare const BadStructErrorHandler: ErrorHandler<StatusWithPayload, ZodError<unknown>>;
/**
 * Unauthorized Error Handler
 */
declare const UnauthorizedErrorHandler: ErrorHandler<StatusWithPayload, UnauthorizedError>;
/**
 * Forbidden Error Handler
 */
declare const ForbiddenErrorHandler: ErrorHandler<StatusWithPayload, ForbiddenError>;
/**
 * Session Error Handler
 */
declare const SessionExpiredErrorHandler: ErrorHandler<StatusWithPayload, SessionExpiredError>;
/**
 * Basic ErrorHandler (sends back 500 with the message of the error)
 */
declare const BasicErrorHandler: ErrorHandler<StatusWithPayload, Error>;
/**
 * DefaultErrorHandler dealing with input validation and error thrown
 */
declare const DefaultErrorHandler: NextErrorHandler;
declare const StandaloneErrorHandler: ErrorHandler<Response>;
/**
 * empty error handler
 */
declare const emptyErrorHandler: NextErrorHandler;

type Slug = Record<string, string | string[]>;
type Handler<S extends Slug = {}> = (req: NextRequest, params: S) => Promise<Response>;

type providedAC<AC extends ApplicationContext<any, any>> = AC['ProvidedType'];
type configAC<AC extends ApplicationContext<any, any>> = AC['ConfigType'];
type providedWithConfigAC<AC extends ApplicationContext<any, any>> = AC['ProvidedType'] & {
    config: configAC<AC>;
};
/**
 * Application context
 * Contains confuguration and providers
 * aimed to be used independantly from the handlers when required
 */
declare class ApplicationContext<C extends FlatShape, P extends ProvidedMap> {
    readonly ConfigType: lowerCaseKeys<C>;
    readonly ProvidedType: P;
    readonly config: lowerCaseKeys<C>;
    private configProvider;
    readonly asProvider: Provider<{
        config: lowerCaseKeys<C>;
    } & P>;
    readonly provider: Provider<P>;
    constructor(configuration: Configuration<C>, fn: (c: lowerCaseKeys<C>) => Provider<P>);
    /**
     *
     * @param fn the funciton that needs the app context
     * @returns
     */
    withAppContext<T>(fn: (provided: P, config: lowerCaseKeys<C>) => Promise<T>): Promise<T>;
    createHandler(errorHandler: ErrorHandler<Response>): <S extends Slug = {}>(fn: (provided: providedWithConfigAC<this>, s: S, r: NextRequest) => Promise<Response>) => Handler<S>;
    static build<C extends FlatShape, P extends ProvidedMap>(configuration: Configuration<C>, fn: (c: lowerCaseKeys<C>) => Provider<P>): ApplicationContext<C, P>;
    static readonly empty: ApplicationContext<any, any>;
}

type RequestWithPayload<T extends NextApiRequest, P> = NextApiRequest & T & {
    payload: P;
};
declare const wrapRequest: <Req extends NextApiRequest, T extends Record<string, unknown>>(req: Req, t: T) => Req & T;
/**
 * RequestTransformer
 * Transforms a request by enhancing it with new properties
 */
declare class RequestTransformer<T extends NextApiRequest, U extends T> {
    private transformator;
    constructor(transformator: (t: T) => Promise<U>);
    /**
     * actually transforms the request
     * @param req input the request
     * @returns transformed, enhanced request
     */
    exec(req: T): Promise<U>;
    /**
     * maps a transformation to be executed after the initial one
     * @param fn transformer to be executed after the initial one
     * @returns the new RequestTransformer
     */
    map<V extends U>(fn: (u: U) => Promise<V>): RequestTransformer<U, V>;
    /**
     * Filters on a result
     * @param fn the predicate
     * @returns
     */
    filter(fn: (u: U) => U | Error): RequestTransformer<U, U>;
    /**
     * Chains the current transformator with another one, creating a RequestTransformer which will transform
     * your request from T to V
     * @param other the other RequestTransformer
     * @returns the new RequestTransformer
     */
    andThen<V extends U>(other: RequestTransformer<U, V>): RequestTransformer<T, V>;
    /**
     * Adds and validate a payload to the RequestTransformer
     * @param structure the payload validator
     * @returns RequestTransformer with payload validation
     */
    withPayload<P>(structure: ZodType<P>): RequestTransformer<T, RequestWithPayload<U, P>>;
}
/**
 * Empty Request Transformer
 */
declare const emptyRequestTransformer: RequestTransformer<NextApiRequest, NextApiRequest>;
/**
 * Handy RequestTransformer creator
 * @param fn the transformer to apply on the NextApiRequest
 * @returns the new RequestTransformer
 */
declare function transformReq<U extends NextApiRequest>(fn: (req: NextApiRequest) => Promise<U>): RequestTransformer<NextApiRequest, U>;
/**
 * Handy RequestTransformer creator
 * @param fn the transformer to apply on the request fed into it
 * @returns the new RequestTransformer
 */
declare function newReqTransformer<T extends NextApiRequest, U extends T>(fn: (req: T) => Promise<U>): RequestTransformer<T, U>;
/**
 * Creates a RequestTransformer with a payload
 * @param structure the payload validator
 * @returns the new RequestTransformer
 */
declare function withPayload<T extends NextApiRequest, P>(structure: ZodType<P>): RequestTransformer<T, RequestWithPayload<T, P>>;

type Executor<R extends NextApiRequest, OUT, PM extends ProvidedMap> = (req: R, provided: PM, res: NextApiResponse<OUT>) => Promise<ApiResponse<OUT>>;
declare class ResponseWithStatus<T> {
    readonly body: T;
    readonly status: number;
    constructor(body: T, status: number);
}
declare const responseWithStatus: <T>(body: T, status: number) => ResponseWithStatus<T>;
/**
 * HTTPHandler
 * The HTTPHandler's goal is to gather eversthing you will need to handle a request correctly and pin-point you to the good request based on the HTTP Method.
 * It will manage for you:
 *  - Error Handling (through ErrorHandler) when you build it
 *  - Request Enhancements (through RequestTransformer when you build it)
 *  - Provide any other factory or service you would need in order to achieve your call (through Providers)
 *  - Strongly type the output of the handler
 *
 * Please take note that all of the above are composable and reusable elements.
 * The end goal of this is to have a bunch of those reusable and composable elements at your disposal and just compose them
 * in a way that will fit your needs
 * EG A handler which has
 *     - PUT method (returns 405 if method isn't correct)
 *     - the authenticated user (returned 401 for a non-authenticated user)
 *     - the payload required for the call (returns 400 if the payload isn't valid)
 *     - A database table / collection provided in order to make a change to its profile
 *     - A logger for this particular HTTP call
 *     - returns the updated user simply (through return statement)
 *
 * Example usage (check __test__ for more):
 *
 * export const AuthenticatedHandler = buildHandler(
 *     AuthenticatedRequestTransformer,
 *     DefaultErrorHandler,
 *     SupabaseProvider.and(LoggingHttpCallProvider)
 *   )
 * ...
 * > in next handler file:
 * import {AuthenticatedHandler} from "..."
 * ...
 * export default AuthenticatedHandler.put(user, user.partial(), async (req: AuthenticatedRequest, {supabase, logger}) => {
 *  ...
 *
 *  return updatedUser; // default status = 200
 * })
 * @template R extends NextApiRequest the request type
 * @template PM extends ProvidedMap the type of the provided map
 */
type HTTPHandler<R extends NextApiRequest, AC extends ApplicationContext<any, any>> = {
    (req: NextApiRequest, res: NextApiResponse): Promise<any>;
    exec(req: NextApiRequest, res: NextApiResponse): Promise<any>;
    get: <OUT>(output: ZodType<OUT>, fn: Executor<R, OUT, providedWithConfigAC<AC>>) => HTTPHandler<R, AC>;
    post: <OUT, P>(output: ZodType<OUT>, struct: ZodType<P>, fn: Executor<RequestWithPayload<R, P>, OUT, providedWithConfigAC<AC>>) => HTTPHandler<R, AC>;
    put: <OUT, P>(output: ZodType<OUT>, struct: ZodType<P>, fn: Executor<RequestWithPayload<R, P>, OUT, providedWithConfigAC<AC>>) => HTTPHandler<R, AC>;
    delete: <OUT>(output: ZodType<OUT>, fn: Executor<R, OUT, providedWithConfigAC<AC>>) => HTTPHandler<R, AC>;
    head: <OUT>(output: ZodType<OUT>, fn: Executor<R, OUT, providedWithConfigAC<AC>>) => HTTPHandler<R, AC>;
};
type ApiResponse<OUT> = OUT | ResponseWithStatus<OUT>;
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
declare function get<OUT>(output: ZodType<OUT>, fn: Executor<NextApiRequest, OUT, {}>): HTTPHandler<NextApiRequest, ApplicationContext<{}, {}>>;
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param structure the request's payload validator
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
declare function post<OUT, PL>(output: ZodType<OUT>, structure: ZodType<PL>, fn: Executor<RequestWithPayload<NextApiRequest, PL>, OUT, {}>): HTTPHandler<NextApiRequest, ApplicationContext<{}, {}>>;
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param structure the request's payload validator
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
declare function put<OUT, PL>(output: ZodType<OUT>, structure: ZodType<PL>, fn: Executor<RequestWithPayload<NextApiRequest, PL>, OUT, {}>): HTTPHandler<NextApiRequest, ApplicationContext<{}, {}>>;
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param structure the request's payload validator
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
declare function del<OUT>(output: ZodType<OUT>, fn: Executor<NextApiRequest, OUT, {}>): HTTPHandler<NextApiRequest, ApplicationContext<{}, {}>>;
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param structure the request's payload validator
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
declare function head<OUT>(output: ZodType<OUT>, fn: Executor<NextApiRequest, OUT, {}>): HTTPHandler<NextApiRequest, ApplicationContext<{}, {}>>;
/**
 * Build a new handler based on its different components
 * @param transformator the request transformer
 * @param errorHandler the error handler (translate errors into HTTP Responses)
 * @param provider the factories / service providers
 * @returns the handler to add your methods on
 */
declare const buildHandler: <R extends NextApiRequest, AC extends ApplicationContext<any, any>>(transformator: RequestTransformer<NextApiRequest, R>, errorHandler?: NextErrorHandler, appContext?: AC | undefined) => HTTPHandler<R, AC>;

declare const createHandler: <S extends Slug>(errorHandler: ErrorHandler<Response>, handler: Handler<S>) => Handler<S>;
declare const payload: <P>(structure: ZodType<P, zod.ZodTypeDef, P>) => Promise<P>;

declare const LoggingContext: _coteries_utils_logs.LoggingContext<"coteries/next", "handlers" | "mongo" | "providers" | "routes" | "front-end">;

declare const isDev: boolean;
declare const isPreview: boolean;
declare const isDevOrPreview: boolean;

export { ApiResponse, ApplicationContext, BadStructErrorHandler, BasicErrorHandler, LoggingContext as CoteriesNextLoggingContext, DefaultErrorHandler, ForbiddenError, ForbiddenErrorHandler, HTTPHandler, LoggingContext, NextErrorHandler, RequestTransformer, RequestWithPayload, ResponseWithStatus, SessionExpiredError, SessionExpiredErrorHandler, StandaloneErrorHandler, StatusWithPayload, UnauthorizedError, UnauthorizedErrorHandler, buildHandler, configAC, createHandler, del, emptyErrorHandler, emptyRequestTransformer, get, head, isDev, isDevOrPreview, isPreview, newReqTransformer, payload, post, providedAC, providedWithConfigAC, put, responseWithStatus, transformReq, withPayload, wrapRequest };
