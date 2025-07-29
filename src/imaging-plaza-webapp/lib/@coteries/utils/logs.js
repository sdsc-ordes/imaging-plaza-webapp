'use strict';

var pino = require('pino');

const DefaultTransports = process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
    : undefined;
const toString = (o, name) => `[${new Date(o.time).toISOString()}][${name}][${pino.levels.labels[o.level]}]: ${o.msg}`;
const browserOptions = (name) => ({
    asObject: process.env.NODE_ENV !== 'development',
    write: {
        trace: e => {
            console.trace(toString(e, name));
        },
        debug: e => {
            console.debug(toString(e, name));
        },
        info: e => {
            console.info(toString(e, name));
        },
        error: e => {
            console.error(toString(e, name));
        },
        warn: e => {
            console.warn(toString(e, name));
        },
        fatal: e => {
            console.error(toString(e, name));
        }
    }
});
const DefaultOptions = {
    level: 'info',
    transport: DefaultTransports
};
let _AllLoggingContexts = [];
class LoggingContext {
    name;
    acceptedLoggers;
    loggerOptions;
    loggers = {};
    constructor(name, acceptedLoggers, loggerOptions = DefaultOptions) {
        this.name = name;
        this.acceptedLoggers = acceptedLoggers;
        this.loggerOptions = {
            ...DefaultOptions,
            ...loggerOptions
        };
    }
    setLevel(level) {
        this.loggerOptions.level = level;
        Object.values(this.loggers).map(l => (l.level = level));
    }
    withOptions(loggerOptions) {
        return new LoggingContext(this.name, this.acceptedLoggers, loggerOptions);
    }
    getLogger(k) {
        const key = k ? (k?.includes(':') ? k : `${this.name}:${k}`) : `${this.name}:*`;
        if (!this.loggers[key]) {
            this.loggers[key] = pino({ ...this.loggerOptions, browser: browserOptions(key) });
        }
        return this.loggers[key];
    }
    static create(name, acceptedLoggers, options = DefaultOptions) {
        const found = _AllLoggingContexts.find(c => c.name === name);
        if (found)
            return found;
        const context = new LoggingContext(name, acceptedLoggers, options);
        _AllLoggingContexts.push(context);
        return context;
    }
}
const setGlobalLoggingLevel = (level) => {
    _AllLoggingContexts.forEach(l => l.setLevel(level));
};
const createLoggingContext = (name, acceptedLoggers, options = DefaultOptions) => {
    return LoggingContext.create(name, acceptedLoggers, options);
};

const UtilsLoggingContext = createLoggingContext('coteries/utils', [
    'apis',
    'configuration',
    'auth',
    'components',
    'utils',
    'errors'
]);

exports.LoggingContext = LoggingContext;
exports.UtilsLoggingContext = UtilsLoggingContext;
exports.createLoggingContext = createLoggingContext;
exports.setGlobalLoggingLevel = setGlobalLoggingLevel;
