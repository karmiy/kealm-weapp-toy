import { getMenuButtonBoundingClientRect, getSystemInfoSync } from '@tarojs/taro';

const systemInfo = getSystemInfoSync();
// 屏幕宽高
export const SCREEN_INFO = {
  width: systemInfo.screenWidth,
  height: systemInfo.screenHeight,
};

// 顶部状态栏高
export const STATUS_BAR_HEIGHT = systemInfo.statusBarHeight ?? 44;

// 胶囊按钮
export const MENU_BUTTON = getMenuButtonBoundingClientRect();

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
