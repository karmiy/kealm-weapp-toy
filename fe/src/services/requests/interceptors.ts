import { Chain } from '@tarojs/taro';

const responseInterceptor = (chain: Chain) => {
    const requestParams = chain.requestParams;

    // then { statusCode, data }
    // catch { errMsg }
    return chain.proceed(requestParams).then(res => {
        // res.statusCode 即后端返回状态码，ctx.status
        // res.data 是 ctx.body，即 { code: xx, data: xx, message: xx }
        if (res.statusCode !== 200) {
            return Promise.reject({
                errMsg: res.data.message ?? '请求过程中发送未知错误',
            });
        }
        return res.data;
    });
};

const interceptors = [responseInterceptor];

export { interceptors };
