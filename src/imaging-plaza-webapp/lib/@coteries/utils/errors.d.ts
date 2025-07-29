declare class DeadlyError extends Error {
    constructor(msg: string);
}

declare abstract class ErrorWithID extends Error {
    readonly id: string;
}

declare abstract class LocalizedError extends ErrorWithID {
    abstract readonly tlKey: string;
}
declare const localizedErrors: (translator: (key: string) => string) => (e: Error) => string;

/**
 * Error that can be recovered from and shouldn't make the app go nuts :D
 */
declare class RecoverableError extends LocalizedError {
    readonly tlKey: string;
    constructor(msg: string);
}

type Class<E> = new (...args: any[]) => E;

/**
 * Error Handler based on Error Class
 * Will feed a NextApiResponse based on the received Error
 * won't do anything if error is not of the class evidence
 */
type ErrorHandler<RT, E extends Error = Error> = {
    (e: Error): RT;
    evidence: Class<E> | ((e: Error) => boolean);
    map<U>(fn: (t: RT) => U): ErrorHandler<U, E>;
    and<OE extends Error>(other: ErrorHandler<RT, OE>): ErrorHandler<RT, Error>;
};
/**
 * handy ErrorHandler builder
 * @param clazz the Error's class
 * @param fn the function to apply when error is instanceof class
 * @returns the ErrorHandler
 */
declare const errorHandler: <RT, E extends Error>(evidence: Class<E> | ((e: Error) => boolean), fn: (e: E) => RT) => ErrorHandler<RT, E>;

export { DeadlyError, ErrorHandler, ErrorWithID, LocalizedError, RecoverableError, errorHandler, localizedErrors };
