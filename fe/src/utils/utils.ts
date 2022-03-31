import { getSystemInfoSync, navigateTo, redirectTo, switchTab } from '@tarojs/taro';

/* 顶部状态栏高 */
export const statusBarHeight = getSystemInfoSync().statusBarHeight ?? 44;

/* 缓存 key */
const STORAGE_KEY_PREFIX = 'kirby-accounts-';

export function getStorageKey(key: string) {
    return `${STORAGE_KEY_PREFIX}${key}`;
}

/* 跳转页面 */
export function navigateToPage(options: {
    pageName: string;
    isRedirect?: boolean;
    isSwitchTab?: boolean;
    params?: Record<string, string | boolean | number>;
}) {
    const { pageName, isRedirect = false, isSwitchTab = false, params = {} } = options;

    const search = Object.keys(params).reduce((s, key, index) => {
        s += `${index ? '&' : '?'}${key}=${String(params[key])}`;
        return s;
    }, '');

    const url = `/pages/${pageName}/index${search}`;

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
