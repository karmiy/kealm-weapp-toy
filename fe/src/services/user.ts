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

/**
 * @description 获取用户记账信息
 * @returns
 */
export async function getUserAccountStatistics() {
    return httpRequest.get<{
        usage_days: number;
        account_days: number;
        account_count: number;
    }>({
        url: '/user/getAccountStatistics',
    });
}
