import { useCallback, useState } from 'react';
import { stopPullDownRefresh, useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { PAGE_ID } from '@shared/utils/constants';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { getCurrentPageId } from '@shared/utils/router';
import { debounceWithPromise } from '@shared/utils/utils';
import { sdk } from '@core';
import { useDebounceFunc } from './useDebounceFunc';

const PAGE_SYNC_DEBOUNCE_TIME = 20 * 1000; // 同一个页面的请求 debounce
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
  syncContactList: () => sdk.modules.user.syncContactList(),
  syncPrizeList: () => sdk.modules.prize.syncPrizeList(),
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
  enableSyncOnPageShow?: boolean;
  // 非 scrollView 滚动的页面使用，需要在页面 config.ts 配置 enablePullDownRefresh
  // 页面由 scrollView 滚动时需要为 false，配合 scrollView 下拉
  enablePagePullDownRefresh?: boolean;
  refreshMinDuration?: number;
}) {
  const {
    enableSyncOnPageShow = true,
    enablePagePullDownRefresh = false,
    refreshMinDuration = 1500,
  } = options || {};

  const [refresherTriggered, setRefresherTriggered] = useState(false);

  const handleSync = useCallback(
    async (params?: { errorToast?: boolean; debounceApi?: boolean }) => {
      const { errorToast = false, debounceApi = true } = params || {};
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
        const api = debounceApi ? syncApi : syncContext;
        switch (pageId) {
          case PAGE_ID.HOME:
            await Promise.all([api.syncProductCategoryList(), api.syncProductList()]);
            break;
          case PAGE_ID.TASK:
            await Promise.all([
              api.syncTaskCategoryList(),
              api.syncTaskFlowList(),
              api.syncTaskList(),
              api.syncUserInfo(),
              api.syncContactList(),
            ]);
            break;
          case PAGE_ID.TASK_CATEGORY_MANAGE:
            await api.syncTaskCategoryList();
            break;
          case PAGE_ID.TASK_FLOW_MANAGE:
            await Promise.all([api.syncTaskFlowList(), api.syncContactList()]);
            break;
          case PAGE_ID.MINE:
            await api.syncUserInfo();
            break;
          case PAGE_ID.CHECKOUT:
            await Promise.all([api.syncUserInfo(), api.syncCouponList()]);
            break;
          case PAGE_ID.COUPON:
            await api.syncCouponList();
            break;
          case PAGE_ID.PRODUCT_CATEGORY_MANAGE:
            await api.syncProductCategoryList();
            break;
          case PAGE_ID.PRODUCT_SEARCH:
          case PAGE_ID.PRODUCT_FRESH_ARRIVAL:
            await api.syncProductList();
            break;
          case PAGE_ID.PRIZE_MANAGE:
            await Promise.all([api.syncPrizeList(), api.syncCouponList()]);
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
    },
    [],
  );

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
    if (!enableSyncOnPageShow) {
      return;
    }
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
    if (!enablePagePullDownRefresh) {
      return;
    }
    // 页面需要开启配置 enablePagePullDownRefresh，关闭 disableScroll
    logger.info('usePullDownRefresh', 'start pull down refresh');

    const minDelay = new Promise(resolve => setTimeout(resolve, refreshMinDuration));
    await Promise.all([minDelay, handleSync({ errorToast: true, debounceApi: false })]);
    logger.info('usePullDownRefresh', 'end pull down refresh');
    stopPullDownRefresh();
  });

  const handleRefresh = useCallback(async () => {
    logger.info('handleRefresh', 'start pull down refresh');
    setRefresherTriggered(true);

    const minDelay = new Promise(resolve => setTimeout(resolve, refreshMinDuration));
    await Promise.all([minDelay, handleSync({ errorToast: true, debounceApi: false })]);

    logger.info('handleRefresh', 'stop pull down refresh');
    setRefresherTriggered(false);
  }, [handleSync, refreshMinDuration]);

  return { handleSync, handleRefresh, refresherTriggered };
}
