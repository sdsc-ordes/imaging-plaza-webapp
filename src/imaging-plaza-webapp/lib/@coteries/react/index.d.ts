import { DependencyList } from 'react';
import * as _coteries_utils_logs from '@coteries/utils/logs';

declare function useAsyncMemo<T>(factory: () => Promise<T>, deps?: DependencyList): {
    isLoading: boolean;
    value: T | null;
};

declare function useAsyncEffect(effect: () => Promise<void>, deps?: DependencyList): void;

declare function useIsHydrated(): boolean;

declare const LoggingContext: _coteries_utils_logs.LoggingContext<"coteries/react", never>;

export { LoggingContext as CoteriesReactLogger, useAsyncEffect, useAsyncMemo, useIsHydrated };
