'use strict';

var uuid = require('uuid');
var logs = require('./logs');

class DeadlyError extends Error {
    constructor(msg) {
        super(msg);
    }
}

class ErrorWithID extends Error {
    id = uuid.v4();
}

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

class LocalizedError extends ErrorWithID {
}
const localizedErrors = (translator) => (e) => {
    if (e instanceof LocalizedError) {
        return interpolate(translator(e.tlKey) + ` ID: ${e.id}`, { error: e });
    }
    else if (e instanceof ErrorWithID) {
        return e.message + ` ID: ${e.id}`;
    }
    else {
        return e.message;
    }
};

/**
 * Error that can be recovered from and shouldn't make the app go nuts :D
 */
class RecoverableError extends LocalizedError {
    tlKey = 'errors.recoverable';
    constructor(msg) {
        super(msg);
    }
}

const isClass = (object) => {
    const propertyNames = Object.getOwnPropertyNames(object);
    return (typeof object === 'function' &&
        propertyNames.includes('prototype') &&
        !propertyNames.includes('arguments') &&
        object?.toString?.().startsWith('class'));
};

/**
 * Most used HTTPMethods
 */
var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod["GET"] = "GET";
    HTTPMethod["POST"] = "POST";
    HTTPMethod["PUT"] = "PUT";
    HTTPMethod["HEAD"] = "HEAD";
    HTTPMethod["DELETE"] = "DELETE";
})(HTTPMethod || (HTTPMethod = {}));

const logger = logs.UtilsLoggingContext.getLogger('errors');
/**
 * implementation of the ErrorHandler
 */
class CErrorHandler {
    evidence;
    fn;
    check;
    /**
     * @param clazz the Class of the error
     * @param fn the handler for this error
     */
    constructor(evidence, fn) {
        this.evidence = evidence;
        this.fn = fn;
        logger.debug(evidence, isClass(evidence) ? ' is a class' : 'is a function');
        this.check = isClass(evidence)
            ? ((e) => e instanceof evidence)
            : evidence;
    }
    /**
     * Executes this error on the NextApiResponse
     * @param e the error
     * @param resp the response to send back
     */
    exec(e) {
        if (this.check(e)) {
            return this.fn(e);
        }
        else {
            throw e;
        }
    }
    map(fn) {
        return new CErrorHandler(this.evidence, e => fn(this.fn(e))).toErrorHandler();
    }
    /**
     * Composes a error handler with another one
     * @param other the other errorhandler
     * @returns the composed errorHandler (based on Error because typescript doesn't suport supertypes)
     */
    and(other) {
        return new CErrorHandler(Error, e => {
            if (this.check(e)) {
                return this.fn(e);
            }
            else {
                return other(e);
            }
        }).toErrorHandler();
    }
    /**
     * Converts to ErrorHandler
     * @returns the errorHandler
     */
    toErrorHandler() {
        return Object.assign((e) => this.exec(e), {
            evidence: this.evidence,
            map: (fn) => this.map(fn),
            and: (other) => this.and(other)
        });
    }
}
/**
 * handy ErrorHandler builder
 * @param clazz the Error's class
 * @param fn the function to apply when error is instanceof class
 * @returns the ErrorHandler
 */
const errorHandler = (evidence, fn) => {
    return new CErrorHandler(evidence, fn).toErrorHandler();
};

exports.DeadlyError = DeadlyError;
exports.ErrorWithID = ErrorWithID;
exports.LocalizedError = LocalizedError;
exports.RecoverableError = RecoverableError;
exports.errorHandler = errorHandler;
exports.localizedErrors = localizedErrors;
