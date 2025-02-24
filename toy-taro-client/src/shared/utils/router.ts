import { getCurrentPages, navigateTo, redirectTo, reLaunch, switchTab } from '@tarojs/taro';
import { PAGE_ID } from './constants';
import { Logger } from './logger';

const logger = Logger.getLogger('[Utils]').tag('[Router]');

interface NavigateOptions {
  pageName: PAGE_ID;
  isRedirect?: boolean;
  isSwitchTab?: boolean;
  isRelaunch?: boolean;
  params?: Record<string, string | boolean | number>;
}

const pagePathMap = new Map<PAGE_ID, string>([
  [PAGE_ID.TASK_MANAGE, 'taskManage/entrance'],
  [PAGE_ID.TASK_CATEGORY_MANAGE, 'taskManage/categoryManage'],
  [PAGE_ID.TASK_FLOW_MANAGE, 'taskManage/taskFlowManage'],
  [PAGE_ID.PRODUCT_MANAGE, 'productManage/entrance'],
  [PAGE_ID.PRODUCT_CATEGORY_MANAGE, 'productManage/categoryManage'],
  [PAGE_ID.COUPON, 'coupon/entrance'],
  [PAGE_ID.COUPON_MANAGE, 'coupon/couponManage'],
  [PAGE_ID.LUCKY_DRAW, 'luckyDraw/entrance'],
  [PAGE_ID.LUCKY_DRAW_DETAIL, 'luckyDraw/detail'],
  [PAGE_ID.LUCKY_DRAW_HISTORY, 'luckyDraw/history'],
  [PAGE_ID.LUCKY_DRAW_CONFIGURATION, 'luckyDraw/configuration'],
  [PAGE_ID.PRIZE_MANAGE, 'prizeManage/entrance'],
]);
/* 跳转页面 */
export function navigateToPage(options: NavigateOptions) {
  const {
    pageName,
    isRedirect = false,
    isSwitchTab = false,
    isRelaunch = false,
    params = {},
  } = options;

  const search = Object.keys(params).reduce((s, key, index) => {
    s += `${index ? '&' : '?'}${key}=${String(params[key])}`;
    return s;
  }, '');

  const url = `/ui/pages/${pagePathMap.get(pageName) ?? pageName}/index${search}`;

  logger.info('navigateToPage', {
    pageName,
    search,
    url,
  });

  if (isRedirect) {
    redirectTo({
      url,
    });
    return;
  }

  if (isSwitchTab) {
    switchTab({
      url,
    });
    return;
  }

  if (isRelaunch) {
    reLaunch({ url });
    return;
  }

  navigateTo({ url });
}

function getPageIdByPath(path: string): PAGE_ID | undefined {
  for (const [key, value] of pagePathMap) {
    if (value === path) {
      return key;
    }
  }
  return;
}

export function getCurrentPageId() {
  const currentPage = [...getCurrentPages()].pop();
  if (!currentPage) {
    return;
  }
  // currentPage.route: ui/pages/task/index, ui/pages/taskManage/categoryManage/index
  // slice(2, -1) 是去掉 ui/pages/ 和 index
  const pagePath = currentPage.route?.split('/').slice(2, -1).join('/'); // task, taskManage/categoryManage
  if (!pagePath) {
    return;
  }

  // 先看纯 pageId 能不能找到
  const plainPageId = Object.values(PAGE_ID).find(id => id === pagePath);
  if (plainPageId) {
    return plainPageId;
  }

  // 再看 pagePathMap 的映射表
  const specialPageId = getPageIdByPath(pagePath);
  if (specialPageId) {
    return specialPageId;
  }
  return;
}
