import { useEffect, useMemo } from 'react';
import { useMount } from 'ahooks';
import { atom, useRecoilState } from 'recoil';
import { getTypeList } from '@/services';
import { asyncWrapper } from '@/utils/base';
import { ACCOUNT_MODE } from '@/utils/constants';

const typeListState = atom<ModelNS.AccountType[]>({
    key: 'accountTypeList',
    default: [],
});

export function useTypeListStore() {
    const [typeList, setTypeList] = useRecoilState(typeListState);

    useMount(async () => {
        // 别的页面请求过就不请求了
        if (typeList.length) return;

        const [res, err] = await asyncWrapper(getTypeList());

        if (err || !res || !res.data) return;

        const { list = [] } = res.data;
        setTypeList(list);
    });

    const [inComeTypeList, expenditureTypeList] = useMemo(() => {
        const inCome: ModelNS.AccountType[] = [];
        const expenditure: ModelNS.AccountType[] = [];
        typeList.forEach(item => {
            item.account_mode === ACCOUNT_MODE.支出 ? expenditure.push(item) : inCome.push(item);
        });
        return [inCome, expenditure];
    }, [typeList]);

    return {
        typeList,
        inComeTypeList,
        expenditureTypeList,
    };
}
