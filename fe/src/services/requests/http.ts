import { addInterceptor, request } from '@tarojs/taro';
import { interceptors } from './interceptors';
import { getBaseUrl } from './url';

interceptors.forEach(item => addInterceptor(item));

type Request = typeof request;
type Options = Parameters<Request>[number];

class HttpRequest {
    private baseUrl = '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    request<T = any, U = any>(options: Options) {
        const { url, header, ...restOptions } = options;
        return request<T, U>({
            url: `${this.baseUrl}${url}`,
            header: {
                'Content-Type': 'application/json',
                ...header,
            },
            ...restOptions,
        } as any) as Promise<{ data: T; message?: string }>;
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
}

export default new HttpRequest(getBaseUrl('/v1/accounts'));
