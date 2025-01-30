import { useEffect, useRef, useState } from 'react';

export function useLoading(options?: { timeout?: number }) {
  const { timeout = 1500 } = options ?? {};
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, timeout);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [timeout]);

  return isLoading;
}
