import { Chain, getStorageSync } from '@tarojs/taro';
import { getStorageKey, navigateToPage } from '@/utils/utils';

const requestInterceptor = (chain: Chain) => {
    const requestParams = chain.requestParams;
    const { url, header } = requestParams;

    // 自动携带 token
    const Authorization = getStorageSync<string>(getStorageKey('auth'));

    // 登录接口不需要校验
    const isIgnorePath = url.includes('login');

    // 缓存没有 token，直接跳登录页
    if (!Authorization && !isIgnorePath) {
        navigateToPage({
            pageName: 'login',
            isRedirect: true,
        });
        return Promise.reject({
            errMsg: '登录已失效',
        });
    }

    const authOptions = !isIgnorePath ? { Authorization } : {};

    const options = {
        ...requestParams,
        header: {
            ...header,
            ...authOptions,
        },
    };
    return chain.proceed(options);
};

const responseInterceptor = (chain: Chain) => {
    const requestParams = chain.requestParams;

    // then { statusCode, data }
    // catch { errMsg }
    return chain.proceed(requestParams).then(res => {
        // res.statusCode 即后端返回状态码，ctx.status
        // res.data 是 ctx.body，即 { code: xx, data: xx, message: xx }
        const { data, statusCode } = res;
        // token 失效，跳转登录
        if (statusCode === 401) {
            navigateToPage({
                pageName: 'login',
                isRedirect: true,
            });

            return Promise.reject({
                errMsg: '登录已失效',
            });
        }
        if (statusCode !== 200) {
            return Promise.reject({
                errMsg: res.data.message ?? '请求过程中发送未知错误',
            });
        }
        return data;
    });
};

const interceptors = [requestInterceptor, responseInterceptor];

export { interceptors };
