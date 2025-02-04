import { getMenuButtonBoundingClientRect, getWindowInfo } from '@tarojs/taro';

const systemInfo = getWindowInfo();
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

export class Singleton {
  private static _instances: Map<string, any> = new Map();

  // 小程序压缩代码后预览时无法拿到 class.name
  static getInstance<T>(this: (new () => T) & { identifier: string }): T {
    const name = this.identifier;
    if (!Singleton._instances.has(name)) {
      Singleton._instances.set(name, new this());
    }
    return Singleton._instances.get(name);
  }

  dispose<T extends Singleton>(this: T) {
    const name = (this.constructor as unknown as { identifier: string }).identifier;
    Singleton._instances.delete(name);
  }
}

export const getStorageKey = (key: string) => `kealm-storage-toy-client_${key}`;

export class JsError extends Error {
  constructor(public code: string | number, message: string) {
    super(message);
  }
}

export const cleanEmptyFields = <T extends Record<string, any>>(
  obj: T,
  options?: {
    ignoreList?: unknown[];
  },
): T => {
  const { ignoreList = [undefined, null, ''] } = options ?? {};
  const cleanedObj: T = {} as T;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (!ignoreList.includes(value)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedValue = cleanEmptyFields(value, options); // 递归处理对象
          if (Object.keys(cleanedValue).length > 0) {
            cleanedObj[key] = cleanedValue;
          }
        } else {
          cleanedObj[key] = value;
        }
      }
    }
  }

  return cleanedObj;
};
