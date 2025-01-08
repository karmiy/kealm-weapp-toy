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

export function asyncWrapper<T>(promise: Promise<T>) {
  return promise
    .then(data => [data, null] as [T, null])
    .catch(err => [null, { res: err }] as [null, { res: any }]);
}

export const sleep = (duration = 1000) => new Promise(r => setTimeout(r, duration));

export const uuid = () => Math.random().toString(36).slice(2);

export const createSpecClassName = (cls: string) => `${cls}_${uuid()}`;

export const toCamelCase = (input: string) =>
  input.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
