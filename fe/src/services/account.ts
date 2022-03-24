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
    return httpRequest.get({
        url: '/account/getRecords',
        data: {
            ...conditions,
        },
    });
}
