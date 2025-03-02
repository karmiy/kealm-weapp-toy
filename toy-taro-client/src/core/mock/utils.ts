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

type MockApiCache<T> = ReturnType<typeof createMockApiCache<T>>;

export const updateMockApiCache = async <T extends { id?: string }>(
  mockApiCache: MockApiCache<T[]>,
  entity: T,
) => {
  const list = await mockApiCache();
  const index = list.findIndex(item => item.id === entity.id);
  if (index !== -1) {
    list.splice(index, 1, entity);
    mockApiCache.update(list);
    return;
  }
  mockApiCache.update([...list, entity]);
};
