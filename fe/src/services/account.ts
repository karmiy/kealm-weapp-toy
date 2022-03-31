import { ACCOUNT_MODE } from '@/utils/constants';
import { PickPartial } from '@/utils/types';
import httpRequest from './requests/http';

/**
 * @description 获取分类列表
 * @returns
 */
export async function getTypeList(mode?: ACCOUNT_MODE) {
    return httpRequest.get<{
        list: Array<{
            id: number;
            name: string;
            account_mode: number;
        }>;
        size: number;
    }>({
        url: '/account/getTypeList',
        data: {
            mode,
        },
    });
}

/**
 * @description 提交账单
 * @returns
 */
export async function addOrUpdateRecord(record?: {
    id?: number;
    amount: number;
    account_type: number;
    create_time: Date;
    remark?: string;
}) {
    return httpRequest.post({
        url: '/account/addOrUpdateRecord',
        data: {
            ...record,
        },
    });
}

/**
 * @description 获取账单
 * @returns
 */
export async function getRecords(conditions?: {
    year: number;
    month: number;
    page_no: number;
    page_size?: number;
}) {
    return httpRequest.get<{
        count: number;
        rows: Array<{
            id: number;
            amount: number;
            create_time: number;
            remark?: string;
            account_type: {
                id: number;
                name: string;
                account_mode: ACCOUNT_MODE;
            };
        }>;
    }>({
        url: '/account/getRecords',
        data: {
            ...conditions,
        },
    });
}

/**
 * @description 获取收支统计
 * @returns
 */
export async function getStatistics(conditions?: { year: number; month: number }) {
    return httpRequest.get<Record<string, { income: number; expenditure: number }>>({
        url: '/account/getStatistics',
        data: {
            ...conditions,
        },
    });
}

/**
 * @description 根据 id 获取账单
 * @returns
 */
export async function getRecordById(conditions?: { id: number }) {
    return httpRequest.get<{
        id: number;
        amount: number;
        create_time: number;
        remark?: string;
        account_type: {
            id: number;
            name: string;
            account_mode: ACCOUNT_MODE;
        };
    }>({
        url: '/account/getRecordById',
        data: {
            ...conditions,
        },
    });
}
