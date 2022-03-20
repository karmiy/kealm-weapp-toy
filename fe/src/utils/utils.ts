import { getSystemInfoSync } from '@tarojs/taro';

export const statusBarHeight = getSystemInfoSync().statusBarHeight ?? 44;
