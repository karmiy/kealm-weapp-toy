import { useEffect, useState } from 'react';
import { Picker, View } from '@tarojs/components';
import { setStorageSync, showToast } from '@tarojs/taro';
import { useMount } from 'ahooks';
import { format, parseISO } from 'date-fns';
import { isNil } from 'lodash-es';
import { AtButton, AtForm, AtInput, AtToast } from 'taro-ui';
import { ListItem } from '@/components';
import { addOrUpdateRecord } from '@/services';
import { useTypeListStore } from '@/store';
import { sleep } from '@/utils/base';
import { ACCOUNT_MODE, STORAGE_KEYS } from '@/utils/constants';
import { navigateToPage } from '@/utils/utils';
import styles from './index.module.scss';

interface Props {
    mode: ACCOUNT_MODE;
}

export default function (props: Props) {
    const { mode } = props;

    /* ------------------------------ Toast ------------------------------ */
    // const [showToast, setShowToast] = useState(false);
    // const [toastText, setToastText] = useState('');

    /* ------------------------------ 金额 ------------------------------ */
    const [amount, setAmount] = useState('');

    /* ------------------------------ 类别 ------------------------------ */
    const { inComeTypeList, expenditureTypeList } = useTypeListStore();
    const typeList = mode === ACCOUNT_MODE.支出 ? expenditureTypeList : inComeTypeList;
    const typeNames = typeList.map(item => item.name);
    const [typeIndex, setTypeIndex] = useState<number>();

    /* ------------------------------ 日期 ------------------------------ */
    const [createDate, setCreateDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    /* ------------------------------ 时间 ------------------------------ */
    const [createTime, setCreateTime] = useState(format(new Date(), 'HH:mm'));

    /* ------------------------------ 备注 ------------------------------ */
    const [remark, setRemark] = useState('');

    /* ------------------------------ 提交 ------------------------------ */
    const handleFormClear = () => {
        setAmount('');
        setTypeIndex(undefined);
        setCreateDate(format(new Date(), 'yyyy-MM-dd'));
        setCreateTime(format(new Date(), 'HH:mm'));
        setRemark('');
    };
    const onSubmit = () => {
        if (!amount) {
            showToast({
                title: '请输入金额',
                icon: 'error',
            });
            return;
        }

        const accountType = typeList[typeIndex ?? 0];
        if (isNil(typeIndex) || !accountType) {
            showToast({
                title: '请选择类别',
                icon: 'error',
            });
            return;
        }

        if (!createDate) {
            showToast({
                title: '请选择日期',
                icon: 'error',
            });
            return;
        }

        if (!createTime) {
            showToast({
                title: '请选择时间',
                icon: 'error',
            });
            return;
        }

        addOrUpdateRecord({
            amount: Number(amount),
            account_type: accountType.id,
            create_time: parseISO(`${createDate} ${createTime}`),
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
            {/* <View className={`${styles.banner} flex justify-center items-center`}>
                <AtAvatar
                    circle
                    image='https://gitee.com/karmiy/static/raw/master/weapp-accounts/imgs/kirby-1.jpeg'
                    size='large'
                />
            </View> */}
            {/* <Image
                className='w-full'
                src={require('@/images/kirby-3.png')}
                mode='aspectFill'
                style={{ height: `${statusBarHeight + 44 + 86}px` }}
            /> */}
            <AtForm className={styles.form}>
                <AtInput
                    className='text-right'
                    name='account'
                    value={amount}
                    onChange={(v: string) => setAmount(v)}
                    title='金额'
                    type='digit'
                    placeholder='请输入金额'
                />
                <ListItem title='收支' extraText={ACCOUNT_MODE[mode]} />
                <Picker
                    mode='selector'
                    name='type'
                    value={typeIndex}
                    range={typeNames}
                    onChange={e => setTypeIndex(e.detail.value as number)}
                >
                    <ListItem
                        title='类别'
                        extraText={!isNil(typeIndex) ? typeNames[typeIndex] : undefined}
                        placeholder='请选择类别'
                        arrow='right'
                    />
                </Picker>
                <Picker
                    mode='date'
                    name='createDate'
                    value={createDate}
                    onChange={e => setCreateDate(e.detail.value)}
                >
                    <ListItem
                        title='日期'
                        extraText={createDate}
                        placeholder='请选择日期'
                        arrow='right'
                    />
                </Picker>
                <Picker
                    mode='time'
                    name='createTime'
                    value={createTime}
                    onChange={e => setCreateTime(e.detail.value)}
                >
                    <ListItem
                        title='时间'
                        extraText={createTime}
                        placeholder='请选择时间'
                        arrow='right'
                    />
                </Picker>
                <AtInput
                    className='text-right'
                    name='remark'
                    value={remark}
                    onChange={(v: string) => setRemark(v)}
                    title='备注'
                    type='text'
                    placeholder='请输入备注'
                    border={false}
                />
                <View className='mt-24 px-8'>
                    <AtButton type='primary' onClick={onSubmit}>
                        提交
                    </AtButton>
                </View>
            </AtForm>
            {/* <AtToast
                isOpened={showToast}
                status='error'
                onClose={() => setShowToast(false)}
                text={toastText}
                duration={1500}
            /> */}
        </View>
    );
}
