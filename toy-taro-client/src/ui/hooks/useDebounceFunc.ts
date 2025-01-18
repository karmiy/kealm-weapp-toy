import { useCallback, useRef } from 'react';
import { useConsistentFunc } from './useConsistentFunc';

export function useDebounceFunc<T extends (...args: any[]) => any>(fn: T, delay = 500) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const consistentFn = useConsistentFunc(fn);

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        consistentFn(...args);
      }, delay);
    },
    [consistentFn, delay],
  );
}
