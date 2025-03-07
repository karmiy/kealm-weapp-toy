import { useState } from 'react';
import { useConsistentFunc } from '@ui/hooks';

export const BLOCK_ACTION_MARK = '__LOCAL_USE_ACTION_BLOCK_ACTION_MARK' as const;

type ActionResult<A extends (params: any) => Promise<unknown> | unknown> = Exclude<
  Awaited<ReturnType<A>>,
  '__LOCAL_USE_ACTION_BLOCK_ACTION_MARK'
>;

type Options<A extends (params: any) => Promise<unknown> | unknown> = {
  onSuccess?: (value: ActionResult<A>) => unknown | Promise<unknown>;
  onError?: (error: Error) => unknown | Promise<unknown>;
};

export function useAction<A extends (...args: any[]) => Promise<unknown> | unknown>(
  action: A,
  options?: Options<A>,
) {
  type T = Parameters<A>[0] extends undefined ? never : Parameters<A>[0];
  const [isLoading, setIsLoading] = useState(false);

  const actionHandler = useConsistentFunc(
    async (params: T extends undefined ? Options<A> : T & Options<A>) => {
      const { onSuccess, onError, ...rest } = params;
      try {
        if (isLoading) {
          return;
        }
        setIsLoading(true);
        const result = (await action(rest as T)) as ActionResult<A>;
        if (result === BLOCK_ACTION_MARK) {
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        await options?.onSuccess?.(result);
        onSuccess?.(result);
      } catch (error) {
        await options?.onError?.(error);
        onError?.(error);
        setIsLoading(false);
      }
    },
  );

  return [actionHandler, isLoading] as const;
}
