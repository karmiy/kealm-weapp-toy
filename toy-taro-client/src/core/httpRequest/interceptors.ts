import { Chain } from '@tarojs/taro';
import { Logger } from '@shared/utils/logger';
import { JsError } from '@shared/utils/utils';
import { UserStorageManager } from '../base';
import { ERROR_MESSAGE, SERVER_ERROR_CODE } from '../constants';

const logger = Logger.getLogger('[HttpRequestInterceptor]');

const requestInterceptor = (chain: Chain) => {
  const requestParams = chain.requestParams;
  const { url, header, data } = requestParams;

  // 自动携带 token
  const Authorization = UserStorageManager.getInstance().getUserAuth();

  // 登录接口不需要校验
  const isIgnorePath = url.includes('login');
  logger.info('requestInterceptor', { url, data, Authorization, isIgnorePath });
  // 缓存没有 token，直接跳登录页
  if (!Authorization && !isIgnorePath) {
    return Promise.reject(
      new JsError(SERVER_ERROR_CODE.LOGIN_EXPIRED, ERROR_MESSAGE.LOGIN_EXPIRED),
    );
  }

  const authOptions = !isIgnorePath ? { Authorization: `Bearer ${Authorization}` } : {};

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
    const { url } = requestParams;

    logger.info('responseInterceptor', { url, data, statusCode });

    if (statusCode !== 200) {
      return Promise.reject(
        new JsError(SERVER_ERROR_CODE.SERVER_ERROR, ERROR_MESSAGE.UNKNOWN_ERROR),
      );
    }
    // token 失效
    if (data.code !== 200) {
      return Promise.reject(new JsError(data.code, data.message ?? ERROR_MESSAGE.REQUEST_FAILED));
    }
    return data;
  });
};

const interceptors = [requestInterceptor, responseInterceptor];

export { interceptors };
