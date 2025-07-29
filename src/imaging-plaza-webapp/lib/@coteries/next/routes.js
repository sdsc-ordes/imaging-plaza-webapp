'use strict';

var apiUtils = require('@coteries/utils/api-utils');
var utils = require('@coteries/utils');
var router = require('next/router');
var react = require('@chakra-ui/react');
var React = require('react');
var logs = require('@coteries/utils/logs');

const authRoute = () => async (s) => !!s;
const pubRoute = () => async (s) => true;
const protectRoute = (rc) => rc;
const useSafePush = () => {
    const router$1 = router.useRouter();
    const safePush = (route, ...params) => {
        router$1.push(utils.replaceInOrder(route, ...params));
    };
    return safePush;
};
const buildRoutes = (th, buildRoutes) => {
    const routes = {
        '/login': pubRoute(),
        ...buildRoutes({ authRoute, pubRoute, protectRoute })
    };
    return [routes, useSafePush, (r, ...params) => utils.replaceInOrder(r, ...params)];
};
const isCatcher = (matcher) => {
    return (matcher.startsWith('[') || matcher.startsWith('/[')) && matcher.endsWith(']');
};
const findCatcher = (node) => {
    return Object.keys(node).find(isCatcher) ?? null;
};
const isCheck = (route) => {
    return typeof route !== 'object';
};
const getCheck = (route) => {
    if (isCheck(route)) {
        return route;
    }
    return route.check;
};
const isRouteAuthorized = async (routes, nextRoute, session) => {
    const navigate = (node, parts, params = []) => {
        const [head, ...tail] = parts;
        const catcher = findCatcher(node);
        const headElem = node[head] || node[apiUtils.stripLeadingSlash(head)];
        if (headElem || catcher) {
            const elem = headElem ?? node[catcher];
            const newParams = !headElem ? [...params, apiUtils.stripLeadingSlash(head)] : params; // remove the leading slash
            if (tail.length === 0 || isCheck(elem)) {
                return { rc: getCheck(elem), params: newParams };
            }
            else {
                return navigate(elem, tail, newParams);
            }
        }
        return null;
    };
    const parts = nextRoute === '/'
        ? ['/']
        : nextRoute.split('/').reduce((acc, p) => (p ? [...acc, `/${p}`] : acc), []);
    const check = navigate(routes, parts);
    if (check) {
        const result = check.rc(session, ...check.params);
        return result;
    }
    else
        return true;
};
/* EXAMPLE
type SS = { roles: string[] }

const [TestRoute] = buildRoutes(new TypeHolder<SS>(), ({ pubRoute, authRoute, protectRoute }) => ({
  '/test': {
    check: pubRoute(),
    '[id]': {
      check: pubRoute(),
      accept: authRoute(),
      toto2: protectRoute(async session => session?.roles.includes('isToto') ?? false)
    }
  }
}))

type SafeRoute = IsSafeRoute<typeof TestRoute>
*/

const path = (route) => route.split('?')[0];
const RouteGuard = ({ children, routes, session, authenticatedHome }) => {
    const router$1 = router.useRouter();
    const [authorized, setAuthorized] = React.useState(false);
    const lastPath = React.useRef(null);
    const cachedRoutes = React.useRef({});
    React.useEffect(() => {
        cachedRoutes.current = {};
    }, [session]);
    React.useEffect(() => {
        const authCheck = async (route) => {
            const currentPath = path(route);
            if (typeof cachedRoutes.current[currentPath] === 'boolean' &&
                !cachedRoutes.current[currentPath]) {
                router$1.push(session ? authenticatedHome : '/login');
            }
            else if (currentPath !== lastPath.current) {
                setAuthorized(false);
                const isAuthorized = await isRouteAuthorized(routes, currentPath, session);
                cachedRoutes.current[currentPath] = isAuthorized;
                if (!isAuthorized) {
                    router$1.push(session ? authenticatedHome : '/login');
                }
                setTimeout(() => setAuthorized(isAuthorized));
            }
            lastPath.current = currentPath;
        };
        authCheck(router$1.asPath);
        const preventAccess = async (evt) => {
            authCheck(evt);
        };
        router$1.events.on('routeChangeStart', preventAccess);
        return () => {
            router$1.events.off('routeChangeStart', preventAccess);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router$1, router$1.events, session, routes]);
    return authorized ? (React.createElement(React.Fragment, null, children)) : (React.createElement(react.Flex, { h: '100vh', w: '100vw', justifyContent: 'center', alignItems: 'center' },
        React.createElement(react.Spinner, { size: 'xl' })));
};

const LoggingContext = logs.createLoggingContext('coteries/next', [
    'handlers',
    'mongo',
    'providers',
    'routes',
    'front-end'
]);

const logger = LoggingContext.getLogger('routes');
const useRouteAsState = (defaultValue) => {
    const router$1 = router.useRouter();
    const setState = React.useCallback((state) => {
        router$1.replace({ query: { ...router$1.query, ...state } });
    }, [router$1]);
    const state = React.useMemo(() => {
        return router$1.query;
    }, [router$1.query]);
    React.useEffect(() => {
        setState(defaultValue ?? {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [state, setState];
};
const useRouteState = (key, defaultValue) => {
    const [state, setState] = useRouteAsState(defaultValue ? { [key]: defaultValue } : {});
    return [state[key], v => setState({ [key]: v })];
};
const useTransformedRouteState = (key, serializer, defaultValue) => {
    const [state, setState] = useRouteAsState(defaultValue ? { [key]: serializer.serialize(defaultValue) } : {});
    const deserializedState = React.useMemo(() => {
        if (!state[key])
            return null;
        try {
            return serializer.deserialize(state[key]);
        }
        catch (e) {
            logger.error(`cannot deserialize ${state[key]}: `, e);
            return null;
        }
    }, [state, key, serializer]);
    return [deserializedState, (v) => setState({ [key]: serializer.serialize(v) })];
};

exports.RouteGuard = RouteGuard;
exports.authRoute = authRoute;
exports.buildRoutes = buildRoutes;
exports.isRouteAuthorized = isRouteAuthorized;
exports.protectRoute = protectRoute;
exports.pubRoute = pubRoute;
exports.useRouteAsState = useRouteAsState;
exports.useRouteState = useRouteState;
exports.useTransformedRouteState = useTransformedRouteState;
