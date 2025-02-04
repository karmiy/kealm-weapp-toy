import { addInterceptor, request, uploadFile } from '@tarojs/taro';
import { Logger } from '@shared/utils/logger';
import { cleanEmptyFields } from '@shared/utils/utils';
import { JsError } from '@/shared/utils/utils';
import { UserStorageManager } from '../base';
import { ERROR_MESSAGE, SERVER_ERROR_CODE } from '../constants';
import { interceptors } from './interceptors';
import { getBaseUrl } from './url';

interceptors.forEach(item => addInterceptor(item));

type Request = typeof request;
type Options = Parameters<Request>[number];

const logger = Logger.getLogger('[HttpRequest]');

class HttpRequest {
  private baseUrl = '';
  private _errorFallback: ((error: JsError) => void) | undefined;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  registerErrorFallback(callback: (error: JsError) => void) {
    this._errorFallback = callback;
  }

  unregisterErrorFallback() {
    this._errorFallback = undefined;
  }

  request<T = any, U = any>(options: Options) {
    const { url, header, data, ...restOptions } = options;
    const requestData = data ? cleanEmptyFields(data) : data;

    return new Promise<T>((resolve, reject) => {
      return request<T, U>({
        url: `${this.baseUrl}${url}`,
        header: {
          'Content-Type': 'application/json',
          ...header,
        },
        ...restOptions,
        data: requestData,
      } as any)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          this._errorFallback?.(err);
          reject(err);
        });
    });
  }

  get<T = any>(options: Options) {
    return this.request<T>({
      ...options,
      method: 'GET',
    });
  }

  post<T = any>(options: Options) {
    return this.request<T>({
      ...options,
      method: 'POST',
    });
  }

  private _isTempFilePath(filePath: string) {
    return !filePath.includes(getBaseUrl('/'));
  }

  postFormDataFile<T = any>(options: Options & { filePath: string }) {
    const { url, data: formData, filePath } = options;
    const token = UserStorageManager.getInstance().getUserAuth();
    if (!token) {
      const error = new JsError(SERVER_ERROR_CODE.LOGIN_EXPIRED, ERROR_MESSAGE.LOGIN_EXPIRED);
      this._errorFallback?.(error);
      return Promise.reject(error);
    }
    if (!this._isTempFilePath(filePath)) {
      return this.post(options);
    }
    return new Promise<T>((resolve, reject) => {
      uploadFile({
        url: `${this.baseUrl}${url}`,
        filePath, // 临时文件路径
        name: 'file', // 后端接收的字段
        formData: cleanEmptyFields(formData as any) as any,
        header: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        success(res) {
          const { statusCode, data: rawData } = res;
          if (statusCode !== 200) {
            reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, ERROR_MESSAGE.UNKNOWN_ERROR));
            return;
          }
          const data = JSON.parse(rawData) as { code: number; data: T; message: string };
          if (data.code !== 200) {
            reject(new JsError(data.code, data.message ?? ERROR_MESSAGE.REQUEST_FAILED));
            return;
          }
          resolve(data.data);
        },
        fail(err) {
          reject(
            new JsError(SERVER_ERROR_CODE.SERVER_ERROR, err?.errMsg ?? ERROR_MESSAGE.UNKNOWN_ERROR),
          );
        },
      });
    });
  }
}

export const httpRequest = new HttpRequest(getBaseUrl('/v1/toy'));
