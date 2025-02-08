import { useDidShow } from '@tarojs/taro';
import debounce from 'lodash/debounce';
import { PAGE_ID } from '@shared/utils/constants';
import { Logger } from '@shared/utils/logger';
import { getCurrentPageId } from '@shared/utils/router';
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
  const api = debounce(
    () => {
      logger.info('syncApi', 'action', {
        key,
      });
      syncContext[key]();
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

export function useSyncOnPageShow() {
  const handleSync = useDebounceFunc(
    () => {
      const pageId = getCurrentPageId();
      if (!pageId) {
        logger.info('handleSync', 'skip sync on page show, no pageId');
        return;
      }
      logger.info('handleSync', 'pending sync', {
        pageId,
      });
      if (!sdk.getHasLoaded()) {
        logger.info('handleSync', 'skip sync on page show, has not loaded', {
          pageId,
        });
        return;
      }

      try {
        switch (pageId) {
          case PAGE_ID.HOME:
            syncApi.syncProductCategoryList();
            syncApi.syncProductList();
            break;
          case PAGE_ID.TASK:
            syncApi.syncTaskCategoryList();
            syncApi.syncTaskFlowList();
            syncApi.syncTaskList();
            syncApi.syncUserInfo();
            break;
          case PAGE_ID.TASK_CATEGORY_MANAGE:
            syncApi.syncTaskCategoryList();
            break;
          case PAGE_ID.TASK_FLOW_MANAGE:
            syncApi.syncTaskFlowList();
            break;
          case PAGE_ID.MINE:
            syncApi.syncUserInfo();
            break;
          case PAGE_ID.CHECKOUT:
            syncApi.syncUserInfo();
            syncApi.syncCouponList();
            break;
          case PAGE_ID.COUPON:
            syncApi.syncCouponList();
            break;
          case PAGE_ID.PRODUCT_CATEGORY_MANAGE:
            syncApi.syncProductCategoryList();
            break;
          default:
            break;
        }
      } catch (error) {
        logger.error('handleSync', 'sync on page show error', {
          pageId,
          error: error.message,
        });
      }
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
    handleSync();
  });
}
