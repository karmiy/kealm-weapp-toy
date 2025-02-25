interface CacheOptions {
  enabled?: boolean;
  ttl?: number; // 缓存有效期（毫秒）
}

export const createMockApiCache = <T>(
  apiFn: (...args: any[]) => Promise<T>,
  options?: CacheOptions,
) => {
  let cache: { data: T; timestamp: number } | null = null;
  let pendingPromise: Promise<T> | null = null;

  const api = async (...args: any[]): Promise<T> => {
    const { enabled = true, ttl = 0 } = options ?? {};
    const now = new Date().getTime();

    // 检查缓存是否存在且有效
    if (enabled && cache && (ttl === 0 || now - cache.timestamp < ttl)) {
      return cache.data;
    }

    if (pendingPromise) {
      return pendingPromise;
    }

    pendingPromise = (async () => {
      try {
        const result = await apiFn(...args);

        if (enabled) {
          cache = { data: result, timestamp: now };
        }

        return result;
      } finally {
        pendingPromise = null;
      }
    })();

    return pendingPromise;
  };
  const update = (data: T) => {
    cache = { data, timestamp: new Date().getTime() };
  };
  api.update = update;
  return api;
};
