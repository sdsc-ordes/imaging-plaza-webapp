import { TypeHolder } from '@coteries/utils';
import { PropsWithChildren } from 'react';

type RouteCheck<S extends RoleBasedSession> = (session: S | null, ...params: string[]) => Promise<boolean>;
declare const authRoute: () => RouteCheck<any>;
declare const pubRoute: () => RouteCheck<any>;
declare const protectRoute: <S extends RoleBasedSession>(rc: RouteCheck<S>) => RouteCheck<S>;
type RouteBranch<S extends RoleBasedSession> = RouteTree<S> & {
    check: RouteCheck<S>;
};
type RouteLeaf<S extends RoleBasedSession> = RouteCheck<S> | RouteBranch<S>;
type RouteTree<S extends RoleBasedSession> = {
    [k: string]: RouteLeaf<S>;
};
type Routes<S extends RoleBasedSession, RS extends RouteTree<S>> = {
    '/login': RouteCheck<S>;
} & RS;
type SafePush<R extends Routes<any, any>> = (route: IsSafeRoute<R>, ...params: string[]) => void;
declare const buildRoutes: <S extends RoleBasedSession, RS extends RouteTree<S>>(th: TypeHolder<S>, buildRoutes: (checkers: {
    authRoute: () => RouteCheck<any>;
    pubRoute: () => RouteCheck<any>;
    protectRoute: (rc: RouteCheck<S>) => RouteCheck<S>;
}) => RS) => [Routes<S, RS>, () => SafePush<Routes<S, RS>>, <R extends IsSafeRoute<Routes<S, RS>>>(r: R, ...params: string[]) => string];
type RoleBasedSession = {
    roles: string[];
};
declare const isRouteAuthorized: <S extends RoleBasedSession>(routes: RouteTree<S>, nextRoute: string, session: S | null) => Promise<boolean>;
type PathImpl<K extends string, V> = V extends RouteBranch<any> ? `${K}` | `${K}/${PathInternal<Omit<V, 'check'>>}` : `${K}`;
type PathInternal<R extends RouteTree<any>> = {
    [K in keyof R]: PathImpl<K & string, R[K]>;
}[keyof R];
type IsSafeRoute<R extends Routes<any, any>> = {
    [K in keyof R]: PathImpl<K & string, R[K]>;
}[keyof R];

type RouteGuardProps<S extends RoleBasedSession, RS extends RouteTree<S>> = PropsWithChildren<{
    routes: Routes<S, RS>;
    session: S | null;
    authenticatedHome: keyof RS;
}>;
declare const RouteGuard: <S extends RoleBasedSession, RS extends RouteTree<S>>({ children, routes, session, authenticatedHome }: RouteGuardProps<S, RS>) => JSX.Element;

type UseRouteAsState = {
    <T extends Record<string, string>>(defaultValue?: Partial<T>): [
        state: T,
        setState: (t: Partial<T>) => void
    ];
};
declare const useRouteAsState: UseRouteAsState;
type UseRouteState = {
    (key: string, defaultValue?: string): [value: string, setState: (newValue: string) => void];
};
declare const useRouteState: UseRouteState;
type StringStateSerializer<T> = {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
};
type UseTransformedRouteState = {
    <T>(key: string, serializer: StringStateSerializer<T>, defaultValue?: T): [
        value: T | null,
        setState: (newValue: T) => void
    ];
};
declare const useTransformedRouteState: UseTransformedRouteState;

export { IsSafeRoute, RoleBasedSession, RouteBranch, RouteCheck, RouteGuard, RouteLeaf, RouteTree, Routes, StringStateSerializer, UseRouteAsState, UseRouteState, authRoute, buildRoutes, isRouteAuthorized, protectRoute, pubRoute, useRouteAsState, useRouteState, useTransformedRouteState };
