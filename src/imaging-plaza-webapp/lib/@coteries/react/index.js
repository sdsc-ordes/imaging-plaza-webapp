'use strict';

var react = require('react');
var logs = require('@coteries/utils/logs');

function useAsyncEffect(effect, deps) {
    return react.useEffect(() => {
        effect();
    }, deps);
}

function useAsyncMemo(factory, deps) {
    const [isLoading, setLoading] = react.useState(true);
    const valueRef = react.useRef(null);
    useAsyncEffect(async () => {
        setLoading(true);
        valueRef.current = await factory();
        setLoading(false);
    }, deps);
    return { isLoading, value: valueRef.current };
}

function useIsHydrated() {
    const [hydrated, setHydrated] = react.useState(false);
    react.useEffect(() => setHydrated(true), []);
    return hydrated;
}

const LoggingContext = logs.createLoggingContext('coteries/react', []);

exports.CoteriesReactLogger = LoggingContext;
exports.useAsyncEffect = useAsyncEffect;
exports.useAsyncMemo = useAsyncMemo;
exports.useIsHydrated = useIsHydrated;
