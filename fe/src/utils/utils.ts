import { getSystemInfoSync, navigateTo, redirectTo } from '@tarojs/taro';

/* 顶部状态栏高 */
export const statusBarHeight = getSystemInfoSync().statusBarHeight ?? 44;

/* 缓存 key */
const STORAGE_KEY_PREFIX = 'kirby-accounts-';

export function getStorageKey(key: string) {
    return `${STORAGE_KEY_PREFIX}${key}`;
}

/* 跳转页面 */
export function navigateToPage(options: { pageName: string; isRedirect?: boolean }) {
    const { pageName, isRedirect = false } = options;

    const url = `/pages/${pageName}/index`;

    isRedirect
        ? redirectTo({
              url,
          })
        : navigateTo({ url });
}
