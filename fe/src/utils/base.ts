import { isArray, isNil, isString } from 'lodash-es';

type ClassNamesItem = string | Record<string, unknown> | undefined | null | ClassNamesParams;
type ClassNamesParams = Array<ClassNamesItem>;

/**
 * @description 构造 className
 * @param params 合并项
 */
export const classnames = function (...params: ClassNamesParams) {
    const classNames: string[] = [];
    params.forEach(item => {
        if (isNil(item)) return;
        if (isString(item)) {
            item && classNames.push(item);
            return;
        }
        if (isArray(item)) {
            const _classNames = classnames(...item);
            _classNames && classNames.push(_classNames);
            return;
        }

        Object.keys(item).forEach(key => {
            item[key] && classNames.push(key);
        });
    });

    return classNames.join(' ');
};

/**
 * @description 格式化数字
 * @param price
 * @param options
 * @returns
 */
export function formatNumber(
    price?: number,
    options?: {
        // 精度，保留几位小数，默认 2
        precision?: number;
        // 是否严格保留位数，如 1.2 保留 2 位，isStrict 为 true 时显示 1.20，反之可移除多余 0 即 1.2
        isStrict?: boolean;
    },
) {
    const { precision = 2, isStrict = false } = options ?? {};
    price = isNil(price) ? 0 : price;

    // (Math.round(price) / 100).toFixed(2);
    if (isStrict) return price.toFixed(precision);

    return `${parseFloat(price.toFixed(precision))}`;
}

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

/**
 * @description 安全转换为 number
 * @param v
 * @param fallback
 * @returns
 */
export const transToNumber = (v?: string, fallback = 0) => {
    if (isNil(v)) return fallback;

    const value = Number(v);
    if (Number.isNaN(value)) return fallback;

    return value;
};
