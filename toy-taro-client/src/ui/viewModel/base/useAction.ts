import { useState } from 'react';
import { useConsistentFunc } from '@ui/hooks';

export function useAction<T>(
  action: (params: T) => Promise<unknown> | unknown,
  options?: {
    onSuccess?: () => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
  },
) {
  const [isLoading, setIsLoading] = useState(false);

  const actionHandler = useConsistentFunc(
    async (
      params: T & {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      },
    ) => {
      const { onSuccess, onError, ...rest } = params;
      try {
        if (isLoading) {
          return;
        }
        setIsLoading(true);
        const result = await action(rest as T);
        if (result === false) {
          setIsLoading(false);
          return;
        }
        await options?.onSuccess?.();
        onSuccess?.();
        setIsLoading(false);
      } catch (error) {
        await options?.onError?.(error);
        onError?.(error);
        setIsLoading(false);
      }
    },
  );

  return [actionHandler, isLoading] as const;
}
