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
    const { precision = 2, isStrict = true } = options ?? {};
    price = isNil(price) ? 0 : price;

    // (Math.round(price) / 100).toFixed(2);
    if (isStrict) return (price / 100).toFixed(precision);

    return `${parseFloat((price / 100).toFixed(precision))}`;
}
