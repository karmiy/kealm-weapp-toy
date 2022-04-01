import { useRef, useState } from 'react';
import { View } from '@tarojs/components';
import { setStorageSync, showToast } from '@tarojs/taro';
import { AtButton, AtModal } from 'taro-ui';
import { addOrUpdateRecord, destroyRecordById } from '@/services';
import { sleep } from '@/utils/base';
import { ACCOUNT_MODE, STORAGE_KEYS } from '@/utils/constants';
import { navigateToPage } from '@/utils/utils';
import FoundationForm, { FormRef } from '../foundation';
import styles from './index.module.scss';

interface Props {
    item: {
        id: number;
        amount: number;
        mode: ACCOUNT_MODE;
        createTime: number;
        remark?: string;
        accountTypeId: number;
    };
}

export default function (props: Props) {
    const { item } = props;

    const formRef = useRef<FormRef>(null);

    const [visible, setVisible] = useState(false);

    const handleUpdate = () => {
        if (!formRef.current) return;

        const { handleFormValidate, getFields } = formRef.current;

        if (!handleFormValidate()) return;

        const { amount, accountType, createTime, remark } = getFields();
        addOrUpdateRecord({
            id: item.id,
            amount,
            account_type: accountType,
            create_time: createTime,
            remark,
        })
            .then(async () => {
                await showToast({
                    title: '修改成功',
                    icon: 'success',
                });
                await sleep(1500);

                // 跳转到首页
                setStorageSync(STORAGE_KEYS.NAVIGATE_TO_DETAIL, { refresh: true });
                navigateToPage({
                    pageName: 'detail',
                    isSwitchTab: true,
                });
            })
            .catch(() => {
                showToast({
                    title: '添加失败',
                    icon: 'error',
                });
            });
    };

    const handleDelete = () => {
        destroyRecordById({
            id: item.id,
        })
            .then(async () => {
                await showToast({
                    title: '删除成功',
                    icon: 'success',
                });
                await sleep(1500);

                // 跳转到首页
                setStorageSync(STORAGE_KEYS.NAVIGATE_TO_DETAIL, { refresh: true });
                navigateToPage({
                    pageName: 'detail',
                    isSwitchTab: true,
                });
            })
            .catch(() => {
                showToast({
                    title: '删除失败',
                    icon: 'error',
                });
            });
    };

    return (
        <View className='account-form px-8'>
            <FoundationForm ref={formRef} modeSelectable defaultFieldsValue={item} />
            <View className='mt-24 px-8 flex justify-between'>
                <AtButton className={styles.formButton} type='primary' onClick={handleUpdate}>
                    保存
                </AtButton>
                <AtButton className={styles.formButton} onClick={() => setVisible(true)}>
                    删除
                </AtButton>
            </View>
            <AtModal
                className={styles.modal}
                isOpened={visible}
                cancelText='取消'
                confirmText='确认'
                onClose={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                onConfirm={() => handleDelete()}
                content='确认要删除账单吗？'
            />
        </View>
    );
}
