import { format, set, lastDayOfMonth } from 'date-fns';
import { ERROR_MESSAGE } from '../utils/constants';

const hackTime = <T, K extends keyof T>(item: T, prop: K) => {
    item[prop] = new Date(item[prop] as any).getTime() as any;
};

export default {
    base64Encode(str = '') {
        return new Buffer(str).toString('base64');
    },
    asyncWrapper<T>(promise: Promise<T>) {
        return promise
            .then(data => [data, null] as [T, null])
            .catch(err => [null, { res: err }] as [null, { res: any }]);
    },
    isEmpty(value: any): value is undefined | null {
        return typeof value === 'undefined' || value === null;
    },
    getFirstDayOfMonth(year: number, month: number) {
        const date = set(new Date(), {
            year,
            month: month - 1,
            date: 1,
            hours: 0,
            minutes: 0,
            seconds: 0,
        });
        const dateStr = format(date, 'yyyy-MM-dd HH:mm:ss');

        return {
            date,
            dateStr,
        };
    },
    getLastDayOfMonth(year: number, month: number) {
        const date = set(lastDayOfMonth(new Date(year, month - 1)), {
            hours: 23,
            minutes: 59,
            seconds: 59,
        });
        const dateStr = format(date, 'yyyy-MM-dd HH:mm:ss');

        return {
            date,
            dateStr,
        };
    },
    hackCreateTime<T extends { create_time?: string | number }>(item: T) {
        hackTime(item, 'create_time');
    },
    clearSensitive(item: any) {
        if (!item) return;
        if (typeof item !== 'object') return;

        if ('open_id' in item) {
            delete item.open_id;
        }
    },
    getErrorMessage(info?: { err?: { res: any }; defaultMessage?: string }) {
        const { err, defaultMessage = ERROR_MESSAGE.请求 } = info ?? {};
        const { res } = err ?? {};

        const { message, name } = res;
        return message || name || defaultMessage;
    },
};
