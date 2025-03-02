import { useCallback, useLayoutEffect, useState } from 'react';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { useConsistentFunc } from './useConsistentFunc';
import { useGetSet } from './useGetSet';

const logger = Logger.getLogger('[useLoadMore]');

interface Response<T> {
  data: T[];
  hasMore: boolean;
}

export function useLoadMore<T>(options: {
  request: () => Promise<Response<T>> | Response<T>;
  getDefaultList?: () => Response<T>;
  loadMinDuration?: number;
}) {
  const { request, getDefaultList, loadMinDuration = 500 } = options ?? {};
  const [getData, setData] = useGetSet<{ list: T[]; hasMore: boolean }>(() => {
    const response = getDefaultList?.();
    if (!response) {
      return { list: [], hasMore: true };
    }
    return { list: response.data, hasMore: response.hasMore };
  });
  const data = getData();
  const list = data.list;
  const hasMore = data.hasMore;
  const [getLoading, setLoading] = useGetSet(() => false);
  const loading = getLoading();
  const handleLoadMore = useConsistentFunc(async () => {
    try {
      if (getLoading() || !getData().hasMore) {
        return;
      }
      setLoading(true);

      const minDelay = new Promise(resolve => setTimeout(resolve, loadMinDuration));
      const [, response] = await Promise.all([minDelay, request()]);
      setData(prev => {
        return {
          list: [...prev.list, ...response.data],
          hasMore: response.hasMore,
        };
      });
    } catch (error) {
      logger.error(error.message);
      showToast({
        title: error.message ?? '加载更多时出现异常，请联系管理员',
      });
    } finally {
      setLoading(false);
    }
  });

  useLayoutEffect(() => {
    if (!getData().hasMore) {
      return;
    }

    handleLoadMore();
  }, [getData, handleLoadMore]);

  const onScrollToLower = useCallback(() => handleLoadMore(), [handleLoadMore]);

  return {
    list,
    hasMore,
    onScrollToLower,
    loading,
  };
}
