import { useCallback } from 'react';
import { stopPullDownRefresh, useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { PAGE_ID } from '@shared/utils/constants';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { getCurrentPageId } from '@shared/utils/router';
import { debounceWithPromise } from '@shared/utils/utils';
import { sdk } from '@core';
import { useDebounceFunc } from './useDebounceFunc';

const PAGE_SYNC_DEBOUNCE_TIME = 10 * 1000; // 同一个页面的请求 debounce
const SDK_SYNC_LOADED_THRESHOLD_TIME = 10 * 1000; // 切页面同步数据至少要在 bootstrap 后的 Ns 后
const SDK_API_SYNC_DEBOUNCE_TIME = 10 * 1000; // 同一个 API 的 debounce 时间

const logger = Logger.getLogger('[useSyncOnPageShow]');

const syncContext = {
  syncProductCategoryList: () => sdk.modules.product.syncProductCategoryList(),
  syncProductList: () => sdk.modules.product.syncProductList(),
  syncTaskCategoryList: () => sdk.modules.task.syncTaskCategoryList(),
  syncTaskFlowList: () => sdk.modules.task.syncTaskFlowList(),
  syncTaskList: () => sdk.modules.task.syncTaskList(),
  syncCouponList: () => sdk.modules.coupon.syncCouponList(),
  syncUserInfo: () => sdk.modules.user.getUserInfo(),
};
const syncApi = Object.keys(syncContext).reduce((acc, key) => {
  const api = debounceWithPromise(
    () => {
      logger.info('syncApi', 'action', {
        key,
      });
      return syncContext[key]();
    },
    SDK_API_SYNC_DEBOUNCE_TIME,
    {
      leading: true,
      trailing: false,
    },
  );
  acc[key] = api;
  return acc;
}, {} as typeof syncContext);

export function useSyncOnPageShow(options?: {
  enablePullDownRefresh?: boolean;
  refreshMinDuration?: number;
}) {
  const { enablePullDownRefresh = true, refreshMinDuration = 1500 } = options || {};

  const handleSync = useCallback(async (params?: { errorToast?: boolean }) => {
    const { errorToast = false } = params || {};
    const pageId = getCurrentPageId();
    if (!pageId) {
      logger.info('handleSync', 'skip sync on page show, no pageId');
      return;
    }
    if (!sdk.getHasLoaded()) {
      logger.info('handleSync', 'skip sync on page show, has not loaded', {
        pageId,
      });
      return;
    }
    logger.info('handleSync', 'pending sync', {
      pageId,
    });

    try {
      switch (pageId) {
        case PAGE_ID.HOME:
          await Promise.all([syncApi.syncProductCategoryList(), syncApi.syncProductList()]);
          break;
        case PAGE_ID.TASK:
          await Promise.all([
            syncApi.syncTaskCategoryList(),
            syncApi.syncTaskFlowList(),
            syncApi.syncTaskList(),
            syncApi.syncUserInfo(),
          ]);
          break;
        case PAGE_ID.TASK_CATEGORY_MANAGE:
          await syncApi.syncTaskCategoryList();
          break;
        case PAGE_ID.TASK_FLOW_MANAGE:
          await syncApi.syncTaskFlowList();
          break;
        case PAGE_ID.MINE:
          await syncApi.syncUserInfo();
          break;
        case PAGE_ID.CHECKOUT:
          await Promise.all([syncApi.syncUserInfo(), syncApi.syncCouponList()]);
          break;
        case PAGE_ID.COUPON:
          await syncApi.syncCouponList();
          break;
        case PAGE_ID.PRODUCT_CATEGORY_MANAGE:
          await syncApi.syncProductCategoryList();
          break;
        default:
          break;
      }
      logger.info('handleSync', 'sync success', {
        pageId,
      });
    } catch (error) {
      logger.error('handleSync', 'sync on page show error', {
        pageId,
        error: error?.message,
      });
      errorToast &&
        showToast({
          title: error?.message ?? '数据同步失败',
        });
    }
  }, []);

  const handleSyncDebounce = useDebounceFunc(
    () => {
      handleSync();
    },
    PAGE_SYNC_DEBOUNCE_TIME,
    { leading: true, trailing: false },
  );

  // getCurrentPages TabBars 之间切换，都是只有 1 个
  // 没登录也会先到 home 页面再重定向到 login，登录后到 home getCurrentPages 也是 1 个
  useDidShow(() => {
    const pageId = getCurrentPageId();
    if (!pageId) {
      logger.info('useDidShow', 'skip sync on page show, no pageId');
      return;
    }
    if (!sdk.getHasLoaded()) {
      logger.info('useDidShow', 'skip sync on page show, has not loaded', {
        pageId,
      });
      return;
    }
    const now = new Date().getTime();
    if (now - sdk.getLastLoadedTime() < SDK_SYNC_LOADED_THRESHOLD_TIME) {
      logger.info('useDidShow', 'skip sync on page show, last loaded time is too recent', {
        pageId,
      });
      return;
    }
    handleSyncDebounce();
  });

  usePullDownRefresh(async () => {
    if (!enablePullDownRefresh) {
      return;
    }
    // 页面需要开启配置 enablePullDownRefresh，关闭 disableScroll
    logger.info('usePullDownRefresh', 'start pull down refresh');

    const minDelay = new Promise(resolve => setTimeout(resolve, refreshMinDuration));
    await Promise.all([minDelay, handleSync({ errorToast: true })]);
    logger.info('usePullDownRefresh', 'end pull down refresh');
    stopPullDownRefresh();
  });

  return { handleSync };
}
