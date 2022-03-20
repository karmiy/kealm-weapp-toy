import { ACCOUNT_MODE } from '@/utils/constants';
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
