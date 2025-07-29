import pino, { LoggerOptions, Level } from 'pino';

/**
 * Adds the prefix to a string
 */
type addPrefix<Key, Prefix extends string> = Key extends string ? `${Prefix}${Key}` : never;

type Options = Omit<LoggerOptions, 'redact'>;
type prefixedLoggers<NAME extends string, LOGGERS extends string> = {
    [k in LOGGERS]: addPrefix<k, `${NAME}:`> | k;
}[LOGGERS];
declare class LoggingContext<NAME extends string, LOGGERS extends string> {
    readonly name: string;
    private acceptedLoggers;
    protected loggerOptions: Options;
    protected loggers: Record<string, pino.Logger<pino.LoggerOptions>>;
    protected constructor(name: string, acceptedLoggers: LOGGERS[], loggerOptions?: Options);
    setLevel(level: Level): void;
    withOptions(loggerOptions: Options): LoggingContext<NAME, LOGGERS>;
    getLogger(k?: prefixedLoggers<NAME, LOGGERS>): pino.Logger;
    static create<NAME extends string, LOGGERS extends string>(name: NAME, acceptedLoggers: LOGGERS[], options?: Options): LoggingContext<NAME, LOGGERS>;
}
declare const setGlobalLoggingLevel: (level: Level) => void;
declare const createLoggingContext: <NAME extends string, LOGGERS extends string>(name: NAME, acceptedLoggers: LOGGERS[], options?: Options) => LoggingContext<NAME, LOGGERS>;

declare const UtilsLoggingContext: LoggingContext<"coteries/utils", "apis" | "configuration" | "auth" | "components" | "utils" | "errors">;

export { LoggingContext, Options, UtilsLoggingContext, createLoggingContext, setGlobalLoggingLevel };
