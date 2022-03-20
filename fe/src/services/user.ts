import { login as taroLogin } from '@tarojs/taro';
import httpRequest from './requests/http';

/**
 * @description 登录
 * @returns
 */
export async function login() {
    const { code } = await taroLogin();
    return httpRequest.post<{ token: string }>({
        url: '/user/login',
        data: {
            code,
        },
    });
}
