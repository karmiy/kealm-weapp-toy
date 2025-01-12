import { navigateTo, redirectTo, switchTab } from '@tarojs/taro';
import { PAGE_ID } from './constants';
import { Logger } from './logger';

const logger = Logger.getLogger('[Utils]').tag('[Router]');

interface NavigateOptions {
  pageName: PAGE_ID;
  isRedirect?: boolean;
  isSwitchTab?: boolean;
  params?: Record<string, string | boolean | number>;
}

/* 跳转页面 */
export function navigateToPage(options: NavigateOptions) {
  const { pageName, isRedirect = false, isSwitchTab = false, params = {} } = options;

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

  navigateTo({ url });
}
