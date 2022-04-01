import { View } from '@tarojs/components';
import { getCurrentInstance } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { AtActivityIndicator } from 'taro-ui';
import { EditorForm } from '@/components';
import { getRecordById } from '@/services';
import { ACCOUNT_MODE } from '@/utils/constants';

export default function () {
    const { data: recordItem } = useRequest(async () => {
        const id = getCurrentInstance().router?.params?.id;
        if (!id) return;

        const res = await getRecordById({
            id: Number(id),
        });
        const { data } = res;

        return {
            id: data.id,
            amount: data.amount,
            mode: data.account_type.account_mode,
            createTime: data.create_time,
            remark: data.remark,
            accountTypeId: data.account_type.id,
        };
    });

    return (
        <View className='edit'>
            <View className='pt-16'>
                {recordItem ? (
                    <EditorForm item={recordItem} />
                ) : (
                    <AtActivityIndicator mode='center' content='加载中...' />
                )}
            </View>
        </View>
    );
}
