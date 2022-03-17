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
