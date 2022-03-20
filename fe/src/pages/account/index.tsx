import { useState } from 'react';
import { Picker, View } from '@tarojs/components';
import { useUpdateEffect } from 'ahooks';
import { format } from 'date-fns';
import { isNil } from 'lodash-es';
import { AtAvatar, AtButton, AtForm, AtInput } from 'taro-ui';
import { ListItem } from '@/components';
import { login } from '@/services';
import { useTypeListStore } from '@/store';
import styles from './index.module.scss';

export default function () {
    /* ------------------------------ 金额 ------------------------------ */
    const [account, setAccount] = useState('');

    /* ------------------------------ 收入/支出 ------------------------------ */
    const modeNames = ['支出', '收入'];
    const [modeIndex, setModeIndex] = useState<number>(0);

    /* ------------------------------ 类别 ------------------------------ */
    const { inComeTypeList, expenditureTypeList } = useTypeListStore();
    const typeList = modeIndex === 0 ? expenditureTypeList : inComeTypeList;
    const typeNames = typeList.map(item => item.name);
    const [typeIndex, setTypeIndex] = useState<number>();

    /* 更新收支方式时，清空选中 */
    useUpdateEffect(() => {
        setTypeIndex(undefined);
    }, [modeIndex]);

    /* ------------------------------ 日期 ------------------------------ */
    const [createDate, setCreateDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    /* ------------------------------ 时间 ------------------------------ */
    const [createTime, setCreateTime] = useState(format(new Date(), 'HH:mm'));

    /* ------------------------------ 备注 ------------------------------ */
    const [remark, setRemark] = useState('');

    return (
        <View className='account'>
            <View className={`${styles.banner} flex justify-center items-center`}>
                <AtAvatar
                    circle
                    image='https://gitee.com/karmiy/static/raw/master/weapp-accounts/imgs/kirby-1.jpeg'
                    size='large'
                />
            </View>
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
                    value={account}
                    onChange={(v: string) => setAccount(v)}
                    title='金额'
                    type='digit'
                    placeholder='请输入金额'
                />
                <Picker
                    mode='selector'
                    name='mode'
                    value={modeIndex}
                    range={modeNames}
                    onChange={e => setModeIndex(e.detail.value as number)}
                >
                    <ListItem
                        title='收支'
                        extraText={!isNil(modeIndex) ? modeNames[modeIndex] : undefined}
                        placeholder='请选择收支方式'
                        arrow='right'
                    />
                </Picker>
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
                <View className='mt-16 px-8'>
                    <AtButton
                        type='primary'
                        onClick={() => {
                            /* showLoading({
                                title: '加载中',
                            });
                            setTimeout(function () {
                                hideLoading();
                            }, 2000); */

                            login()
                                .then(res => {
                                    console.log('login-----------res', res);
                                })
                                .catch(err => {
                                    console.log('login-----------err', err);
                                });
                        }}
                    >
                        提交
                    </AtButton>
                </View>
            </AtForm>
        </View>
    );
}
