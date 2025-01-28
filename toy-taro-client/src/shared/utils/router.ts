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

  const url = `/ui/pages/${pageName}/index${search}`;

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

export function getCurrentPageId() {
  const currentPage = [...getCurrentPages()].pop();
  if (!currentPage) {
    return;
  }
  const pageId = currentPage.route?.split('/')[2];
  if (!pageId) {
    return;
  }
  return pageId as PAGE_ID;
}
