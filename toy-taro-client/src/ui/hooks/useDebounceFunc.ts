import { useCallback, useRef } from 'react';
import { useConsistentFunc } from './useConsistentFunc';

export function useDebounceFunc<T extends (...args: any[]) => any>(
  fn: T,
  delay = 500,
  options: { leading?: boolean; trailing?: boolean } = {},
) {
  const { leading = false, trailing = true } = options;
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const lastInvokeTime = useRef<number | null>(null);
  const consistentFn = useConsistentFunc(fn);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = new Date().getTime();
      const shouldCallNow =
        leading && (lastInvokeTime.current === null || now - lastInvokeTime.current >= delay);

      if (shouldCallNow) {
        lastInvokeTime.current = now;
        consistentFn(...args);
        return;
      }

      clearTimeout(timer.current);
      if (!trailing) {
        return;
      }
      timer.current = setTimeout(() => {
        consistentFn(...args);
        lastInvokeTime.current = new Date().getTime();
      }, delay);
    },
    [consistentFn, delay, leading, trailing],
  );
}
