import { getSystemInfoSync } from '@tarojs/taro';

/* 顶部状态栏高 */
export const statusBarHeight = getSystemInfoSync().statusBarHeight ?? 44;

/**
 * @description promise 同步拦截
 * @param promise
 * @returns
 */
export function asyncWrapper<T>(promise: Promise<T>) {
    return promise
        .then(data => [data, null] as [T, null])
        .catch(err => [null, { res: err }] as [null, { res: any }]);
}

/**
 * @description mock 时模拟延时的 Promise
 * @param duration 时长，默认 1s
 */
export const sleep = (duration = 1000) => new Promise(r => setTimeout(r, duration));
