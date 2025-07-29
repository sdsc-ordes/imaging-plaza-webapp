'use strict';

var utils = require('@coteries/utils');
var errors = require('@coteries/utils/errors');
var server = require('next/server');
var zod = require('zod');
var provider = require('@coteries/utils/provider');
var async_hooks = require('async_hooks');
var logs = require('@coteries/utils/logs');

class UnauthorizedError extends Error {
    constructor() {
        super('not authorized');
    }
}
class SessionExpiredError extends Error {
    constructor() {
        super('session expired');
    }
}
class ForbiddenError extends Error {
    constructor() {
        super('forbidden');
    }
}

const statusWithPayload = (status, payload) => ({
    status,
    payload
});
/**
 * Bad structure error handler (based on Zod validation)
 */
const BadStructErrorHandler = errors.errorHandler(zod.ZodError, (e) => {
    return statusWithPayload(400, { error: e.errors });
});
/**
 * Unauthorized Error Handler
 */
const UnauthorizedErrorHandler = errors.errorHandler(UnauthorizedError, (_) => {
    return statusWithPayload(401, {});
});
/**
 * Forbidden Error Handler
 */
const ForbiddenErrorHandler = errors.errorHandler(ForbiddenError, (_) => {
    return statusWithPayload(403, {});
});
/**
 * Session Error Handler
 */
const SessionExpiredErrorHandler = errors.errorHandler(SessionExpiredError, (_) => {
    return statusWithPayload(419, {});
});
/**
 * Basic ErrorHandler (sends back 500 with the message of the error)
 */
const BasicErrorHandler = errors.errorHandler(Error, (e) => statusWithPayload(500, { message: e.message }));
/**
 * DefaultErrorHandler dealing with input validation and error thrown
 */
const DefaultErrorHandler = [
    BadStructErrorHandler,
    UnauthorizedErrorHandler,
    ForbiddenErrorHandler,
    SessionExpiredErrorHandler
].reduce((acc, e) => e.and(acc), BasicErrorHandler);
const StandaloneErrorHandler = DefaultErrorHandler.map((s) => server.NextResponse.json(s.payload, { status: s.status }));
/**
 * empty error handler
 */
const emptyErrorHandler = BasicErrorHandler;

const wrap = (modifier) => {
    return modifier;
};

const requestContext = new async_hooks.AsyncLocalStorage();
const withRequestContext = (fn) => wrap(fn => (req, params) => {
    return new Promise(async (res, rej) => {
        return requestContext.run({ body: req.body, headers: req.headers, cookie: req.cookies }, async () => {
            res(await fn(req, params));
        });
    });
})(fn);

const createHandler = (errorHandler, handler) => wrap(fn => withRequestContext(async (req, ps) => {
    try {
        return await fn(req, ps);
    }
    catch (e) {
        if (e instanceof Error) {
            return errorHandler(e);
        }
        throw e;
    }
}))(handler);
const payload = async (structure) => {
    const json = await new Response(requestContext.getStore()?.body).json();
    return structure.parse(json);
};

/**
 * Application context
 * Contains confuguration and providers
 * aimed to be used independantly from the handlers when required
 */
class ApplicationContext {
    ConfigType;
    ProvidedType;
    config;
    configProvider;
    asProvider;
    provider;
    constructor(configuration, fn) {
        this.config = configuration.asObject;
        this.configProvider = provider.singleElementProvider('config', () => this.config);
        this.provider = fn(this.config);
        this.asProvider = this.provider.and(this.configProvider);
    }
    /**
     *
     * @param fn the funciton that needs the app context
     * @returns
     */
    async withAppContext(fn) {
        return fn(await this.provider.provide(), this.config);
    }
    createHandler(errorHandler) {
        return (fn) => {
            return createHandler(errorHandler, async (r, p) => fn(await this.asProvider.provide(), p, r));
        };
    }
    static build(configuration, fn) {
        return new ApplicationContext(configuration, fn);
    }
    static empty = new ApplicationContext(new utils.Configuration(zod.z.object({}), {}), () => provider.emptyProvider);
}

const wrapRequest = (req, t) => {
    return {
        ...req,
        headers: req.headers,
        rawHeaders: req.rawHeaders,
        ...t
    };
};
/**
 * RequestTransformer
 * Transforms a request by enhancing it with new properties
 */
class RequestTransformer {
    transformator;
    constructor(transformator) {
        this.transformator = transformator;
    }
    /**
     * actually transforms the request
     * @param req input the request
     * @returns transformed, enhanced request
     */
    exec(req) {
        return this.transformator(req);
    }
    /**
     * maps a transformation to be executed after the initial one
     * @param fn transformer to be executed after the initial one
     * @returns the new RequestTransformer
     */
    map(fn) {
        return new RequestTransformer(async (req) => fn(await this.transformator(req)));
    }
    /**
     * Filters on a result
     * @param fn the predicate
     * @returns
     */
    filter(fn) {
        return new RequestTransformer(async (req) => {
            const result = fn(await this.transformator(req));
            if (result instanceof Error) {
                throw result;
            }
            else {
                return result;
            }
        });
    }
    /**
     * Chains the current transformator with another one, creating a RequestTransformer which will transform
     * your request from T to V
     * @param other the other RequestTransformer
     * @returns the new RequestTransformer
     */
    andThen(other) {
        return new RequestTransformer(async (req) => other.exec(await this.transformator(req)));
    }
    /**
     * Adds and validate a payload to the RequestTransformer
     * @param structure the payload validator
     * @returns RequestTransformer with payload validation
     */
    withPayload(structure) {
        return new RequestTransformer(async (req) => {
            const transformedReq = await this.transformator(req);
            const result = structure.parse(transformedReq.body);
            return wrapRequest(transformedReq, { payload: result });
        });
    }
}
/**
 * Empty Request Transformer
 */
const emptyRequestTransformer = new RequestTransformer(async (t) => t);
/**
 * Handy RequestTransformer creator
 * @param fn the transformer to apply on the NextApiRequest
 * @returns the new RequestTransformer
 */
function transformReq(fn) {
    return new RequestTransformer(fn);
}
/**
 * Handy RequestTransformer creator
 * @param fn the transformer to apply on the request fed into it
 * @returns the new RequestTransformer
 */
function newReqTransformer(fn) {
    return new RequestTransformer(fn);
}
/**
 * Creates a RequestTransformer with a payload
 * @param structure the payload validator
 * @returns the new RequestTransformer
 */
function withPayload(structure) {
    return new RequestTransformer(async (t) => t).withPayload(structure);
}

const LoggingContext = logs.createLoggingContext('coteries/next', [
    'handlers',
    'mongo',
    'providers',
    'routes',
    'front-end'
]);

const logger = LoggingContext.getLogger('handlers');
class ResponseWithStatus {
    body;
    status;
    constructor(body, status) {
        this.body = body;
        this.status = status;
    }
}
const responseWithStatus = (body, status) => new ResponseWithStatus(body, status);
/**
 * MethodHandler
 * executes a request on a handler provided with all the right arguments and keeping the right types
 * @template R extends NextApiRequest
 * @template S extends R (the refined request for this element)
 * @template PM the provided map
 */
class MethodHandler {
    transformer;
    execute;
    output;
    constructor(output, fn, transformer) {
        this.output = output;
        this.transformer = transformer ?? new RequestTransformer(async (t) => t);
        this.execute = fn;
    }
    /**
     * executes the handler for this request given the provider and the different elements it requires
     * @param req the request
     * @param resp the response
     * @param transformer the request transformer
     * @param provider the provider
     */
    async exec(req, resp, transformer, provider) {
        const transformedReq = await this.transformer.exec(await transformer.exec(req));
        const provided = await provider.provide();
        const result = await this.execute(transformedReq, provided, resp);
        let body;
        if (result instanceof (ResponseWithStatus)) {
            resp.status(result.status);
            body = result.body;
        }
        else {
            resp.status(200);
            body = result;
        }
        const mbBody = this.output.safeParse(body);
        if (mbBody.success) {
            resp.send(mbBody.data);
        }
        else {
            resp.status(500).send({ ...mbBody.error });
        }
    }
}
/**
 * Actual implementation of the HTTPHandler (hidden because cannot be used as a function)
 * A class is required for chaining of elements (.get(...).post(...)...)
 */
class Handler {
    appContext;
    transformator;
    functions;
    errorHandler;
    provider;
    constructor(transformator, functions, errorHandler, appContext) {
        this.appContext = appContext;
        this.transformator = transformator;
        this.functions = functions;
        this.errorHandler = errorHandler;
        this.provider = appContext.asProvider;
    }
    /**
     * Converts the Handler to its usable HTTPHandler counterpart
     * @returns HTTPHandler from handler
     */
    toHTTPHandler() {
        return Object.assign((req, resp) => this.exec(req, resp), {
            get: (output, fn) => {
                return this.addMethod(utils.HTTPMethod.GET, output, fn);
            },
            post: (output, struct, fn) => {
                return this.addMethodP(utils.HTTPMethod.POST, output, struct, fn);
            },
            put: (output, struct, fn) => {
                return this.addMethodP(utils.HTTPMethod.PUT, output, struct, fn);
            },
            delete: (output, fn) => {
                return this.addMethod(utils.HTTPMethod.DELETE, output, fn);
            },
            head: (output, fn) => {
                return this.addMethod(utils.HTTPMethod.HEAD, output, fn);
            },
            exec: (req, res) => this.exec(req, res)
        });
    }
    /**
     * Actual, pristine handler, as it's meant to be executed by next
     * @param req the request
     * @param resp the response
     */
    async exec(req, resp) {
        try {
            const method = this.functions[req.method?.toUpperCase()];
            if (method) {
                await method.exec(req, resp, this.transformator, this.provider);
            }
            else {
                resp.status(405).send(`Unsupported method: ${req.method}}`);
            }
        }
        catch (e) {
            if (e instanceof Error) {
                const { status, payload } = this.errorHandler(e);
                resp.status(status).send(payload);
            }
            else {
                logger.error(e);
            }
        }
    }
    /**
     * Adds a new (payload-less) methodHandler to the HTTPHandler
     * @param method the method of the handler
     * @param output the output type of the response
     * @param fn the handler itself
     * @returns modified HTTPHandler
     */
    addMethod(method, output, fn) {
        return new Handler(this.transformator, {
            ...this.functions,
            [method]: new MethodHandler(output, fn)
        }, this.errorHandler, this.appContext).toHTTPHandler();
    }
    /**
     * Adds a new (with payload) methodHandler to the HTTPHandler
     * @param method the method of the handler
     * @param output the output type validator of the response
     * @param structure the structure of the payload to accept
     * @param fn the handler itself
     * @returns modified HTTPHandler
     */
    addMethodP(method, output, structure, fn) {
        return new Handler(this.transformator, {
            ...this.functions,
            [method]: new MethodHandler(output, fn, withPayload(structure))
        }, this.errorHandler, this.appContext).toHTTPHandler();
    }
    /**
     * Basic method creator
     * @param method the method of the handler
     * @param output the output type validator of the response
     * @param fn  the handler itself
     * @returns new simple HTTPHandler
     */
    static addMethod(method, output, fn) {
        return new Handler(emptyRequestTransformer, { [method]: new MethodHandler(output, fn) }, emptyErrorHandler, ApplicationContext.empty).toHTTPHandler();
    }
    /**
     * Basic method creator
     * @param method the method of the handler
     * @param output the output type validator of the response
     * @param struct the payload type validator of the request
     * @param fn  the handler itself
     * @returns new simple HTTPHandler
     */
    static addMethodP(method, output, struct, fn) {
        return new Handler(withPayload(struct), { [method]: new MethodHandler(output, fn) }, emptyErrorHandler, ApplicationContext.empty).toHTTPHandler();
    }
}
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
function get(output, fn) {
    return Handler.addMethod(utils.HTTPMethod.GET, output, fn);
}
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param structure the request's payload validator
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
function post(output, structure, fn) {
    return Handler.addMethodP(utils.HTTPMethod.POST, output, structure, fn);
}
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param structure the request's payload validator
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
function put(output, structure, fn) {
    return Handler.addMethodP(utils.HTTPMethod.PUT, output, structure, fn);
}
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param structure the request's payload validator
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
function del(output, fn) {
    return Handler.addMethod(utils.HTTPMethod.DELETE, output, fn);
}
/**
 * Simple get handler
 * @param output the type validator of the output
 * @param structure the request's payload validator
 * @param fn the enhanced handler itself
 * @returns the handler to be used by next
 */
function head(output, fn) {
    return Handler.addMethod(utils.HTTPMethod.HEAD, output, fn);
}
/**
 * Build a new handler based on its different components
 * @param transformator the request transformer
 * @param errorHandler the error handler (translate errors into HTTP Responses)
 * @param provider the factories / service providers
 * @returns the handler to add your methods on
 */
const buildHandler = (transformator, errorHandler = BasicErrorHandler, appContext) => {
    return new Handler(transformator, {}, errorHandler, appContext ?? ApplicationContext.empty).toHTTPHandler();
};

const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'development';
const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
const isDevOrPreview = isDev || isPreview;

exports.ApplicationContext = ApplicationContext;
exports.BadStructErrorHandler = BadStructErrorHandler;
exports.BasicErrorHandler = BasicErrorHandler;
exports.CoteriesNextLoggingContext = LoggingContext;
exports.DefaultErrorHandler = DefaultErrorHandler;
exports.ForbiddenError = ForbiddenError;
exports.ForbiddenErrorHandler = ForbiddenErrorHandler;
exports.LoggingContext = LoggingContext;
exports.RequestTransformer = RequestTransformer;
exports.ResponseWithStatus = ResponseWithStatus;
exports.SessionExpiredError = SessionExpiredError;
exports.SessionExpiredErrorHandler = SessionExpiredErrorHandler;
exports.StandaloneErrorHandler = StandaloneErrorHandler;
exports.UnauthorizedError = UnauthorizedError;
exports.UnauthorizedErrorHandler = UnauthorizedErrorHandler;
exports.buildHandler = buildHandler;
exports.createHandler = createHandler;
exports.del = del;
exports.emptyErrorHandler = emptyErrorHandler;
exports.emptyRequestTransformer = emptyRequestTransformer;
exports.get = get;
exports.head = head;
exports.isDev = isDev;
exports.isDevOrPreview = isDevOrPreview;
exports.isPreview = isPreview;
exports.newReqTransformer = newReqTransformer;
exports.payload = payload;
exports.post = post;
exports.put = put;
exports.responseWithStatus = responseWithStatus;
exports.transformReq = transformReq;
exports.withPayload = withPayload;
exports.wrapRequest = wrapRequest;
