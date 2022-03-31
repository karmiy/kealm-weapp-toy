import { View } from '@tarojs/components';
import { getCurrentInstance } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { AtActivityIndicator } from 'taro-ui';
import { AccountForm } from '@/components';
import { getRecordById } from '@/services';
import { ACCOUNT_MODE } from '@/utils/constants';

export default function () {
    const { data } = useRequest(async () => {
        const id = getCurrentInstance().router?.params?.id;
        if (!id) return;

        return getRecordById({
            id: Number(id),
        }).then(res => res.data);
    });

    return (
        <View className='edit'>
            <View className='pt-16'>
                {data ? (
                    <AccountForm mode={ACCOUNT_MODE.支出} />
                ) : (
                    <AtActivityIndicator mode='center' content='加载中...' />
                )}
            </View>
        </View>
    );
}
