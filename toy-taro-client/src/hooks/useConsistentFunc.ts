import { useCallback, useRef } from 'react';

export function useConsistentFunc<T extends (...args: any[]) => any>(func: T): T {
  const funcRef = useRef(func);

  funcRef.current = func;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableFunc = useCallback(
    ((...args: Parameters<T>) => {
      return funcRef.current(...args);
    }) as T,
    [],
  );

  return stableFunc;
}
