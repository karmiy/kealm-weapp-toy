import { useRef } from 'react';
import { View } from '@tarojs/components';
import { setStorageSync, showToast } from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import { addOrUpdateRecord } from '@/services';
import { sleep } from '@/utils/base';
import { ACCOUNT_MODE, STORAGE_KEYS } from '@/utils/constants';
import { navigateToPage } from '@/utils/utils';
import FoundationForm, { FormRef } from '../foundation';

interface Props {
    mode: ACCOUNT_MODE;
}

export default function (props: Props) {
    const { mode } = props;

    const formRef = useRef<FormRef>(null);

    const handleSubmit = () => {
        if (!formRef.current) return;

        const { handleFormClear, handleFormValidate, getFields } = formRef.current;

        if (!handleFormValidate()) return;

        const { amount, accountType, createTime, remark } = getFields();
        addOrUpdateRecord({
            amount,
            account_type: accountType,
            create_time: createTime,
            remark,
        })
            .then(async () => {
                await showToast({
                    title: '添加成功',
                    icon: 'success',
                });
                await sleep(1500);

                // 跳转到首页
                setStorageSync(STORAGE_KEYS.NAVIGATE_TO_DETAIL, { refresh: true });
                navigateToPage({
                    pageName: 'detail',
                    isSwitchTab: true,
                });
                handleFormClear();
            })
            .catch(() => {
                showToast({
                    title: '添加失败',
                    icon: 'error',
                });
            });
    };

    return (
        <View className='account-form px-8'>
            <FoundationForm ref={formRef} defaultFieldsValue={{ mode }} />
            <View className='mt-24 px-8'>
                <AtButton type='primary' onClick={handleSubmit}>
                    提交
                </AtButton>
            </View>
        </View>
    );
}
