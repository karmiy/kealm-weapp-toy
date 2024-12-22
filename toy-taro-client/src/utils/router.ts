import { navigateTo, redirectTo, switchTab } from '@tarojs/taro';

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
