export const toString = Object.prototype.toString;

/**
 * @description 是否为字符串
 * @param value: any
 * @returns {boolean}
 */
export const isString = function (value: any): value is string {
    return toString.call(value) === '[object String]';
};

/**
 * @description 是否为数字
 * @param value: any
 * @returns {boolean}
 */
export const isNumber = function (value: any): value is number {
    return toString.call(value) === '[object Number]';
};

/**
 * @description 是否为空值
 * @param value
 */
export const isEmpty = function (value: any): value is undefined | null {
    return value === undefined || value === null;
};

/**
 * @description 是否为数组
 * @param value: any
 * @returns {boolean}
 */
export const isArray =
    Array.isArray ||
    function (value: any): value is any[] {
        return toString.call(value) === '[object Array]';
    };

type ClassNamesItem = string | Record<string, unknown> | undefined | null | ClassNamesParams;
type ClassNamesParams = Array<ClassNamesItem>;

/**
 * @description 构造 className
 * @param params 合并项
 */
export const classnames = function (...params: ClassNamesParams) {
    const classNames: string[] = [];
    params.forEach(item => {
        if (isEmpty(item)) return;
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
    const { precision = 2, isStrict = true } = options ?? {};
    price = isEmpty(price) ? 0 : price;

    // (Math.round(price) / 100).toFixed(2);
    if (isStrict) return (price / 100).toFixed(precision);

    return `${parseFloat((price / 100).toFixed(precision))}`;
}
