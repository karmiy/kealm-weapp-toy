import { ACCOUNT_MODE } from '@/utils/constants';
import { PickPartial } from '@/utils/types';
import httpRequest from './requests/http';

/**
 * @description 获取分类列表
 * @returns
 */
export async function getTypeList(mode?: ACCOUNT_MODE) {
    return httpRequest.get<{
        list: Array<ModelNS.AccountType>;
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
export async function addOrUpdateRecord(record?: PickPartial<ModelNS.AccountRecord, 'id'>) {
    return httpRequest.post({
        url: '/account/addOrUpdateRecord',
        data: {
            ...record,
        },
    });
}
