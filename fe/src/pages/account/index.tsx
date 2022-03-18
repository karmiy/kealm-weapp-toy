import { useState } from 'react';
import { Picker, View } from '@tarojs/components';
import { hideLoading, showLoading } from '@tarojs/taro';
import { isNil } from 'lodash-es';
import { AtAvatar, AtButton, AtForm, AtInput } from 'taro-ui';
import { ListItem } from '@/components';
import { ACCOUNT_MODE_LIST } from '@/utils/constants';
import styles from './index.module.scss';

export default function () {
    /* ------------------------------ 金额 ------------------------------ */
    const [account, setAccount] = useState('');

    /* ------------------------------ 收入/支出 ------------------------------ */
    const modeNames = ['支出', '收入'];
    const [modeIndex, setModeIndex] = useState<number>(0);

    /* ------------------------------ 类别 ------------------------------ */
    const [typeList, setTypeList] = useState([
        { id: 1, name: '工资' },
        { id: 2, name: '奖金' },
    ]);
    const typeNames = typeList.map(item => item.name);
    const [typeIndex, setTypeIndex] = useState<number>();

    /* ------------------------------ 日期 ------------------------------ */
    const [createDate, setCreateDate] = useState('');

    /* ------------------------------ 备注 ------------------------------ */
    const [remark, setRemark] = useState('');

    return (
        <View className='account'>
            <View className={`${styles.banner} flex justify-center items-center`}>
                <AtAvatar circle image={require('@/images/kirby-1.jpeg')} size='large' />
            </View>
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
                        onClick={e => {
                            console.log(e);
                            showLoading({
                                title: '加载中',
                            });
                            setTimeout(function () {
                                hideLoading();
                            }, 2000);
                        }}
                    >
                        提交
                    </AtButton>
                </View>
            </AtForm>
        </View>
    );
}
