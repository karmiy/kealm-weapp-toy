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

/**
 * Gets the length after the decimal point
 */
export const digitLength = (n: number) => {
    return (n.toString().split('.')[1] || '').length;
};

/**
 * Remove the decimal point from the number
 */
export const floatToInt = (n: number) => {
    return Number(n.toString().replace('.', ''));
};

/**
 * Precision computing multiplication
 */
export const multiplication = (arg1: number, arg2: number) => {
    const baseNum = digitLength(arg1) + digitLength(arg2);
    const result = floatToInt(arg1) * floatToInt(arg2);
    return result / Math.pow(10, baseNum);
};

/**
 * Precision calculation addition
 */
export const add = (arg1: number, arg2: number) => {
    const baseNum = Math.pow(10, Math.max(digitLength(arg1), digitLength(arg2)));
    return (multiplication(arg1, baseNum) + multiplication(arg2, baseNum)) / baseNum;
};

/**
 * Precision calculation subtraction
 */
export const subtraction = (arg1: number, arg2: number) => {
    const baseNum = Math.pow(10, Math.max(digitLength(arg1), digitLength(arg2)));
    return (multiplication(arg1, baseNum) - multiplication(arg2, baseNum)) / baseNum;
};

/**
 * Precision calculation division
 */
export const division = (arg1: number, arg2: number) => {
    const baseNum = Math.pow(10, Math.max(digitLength(arg1), digitLength(arg2)));
    return multiplication(arg1, baseNum) / multiplication(arg2, baseNum);
};
