import { useState } from 'react';
import { Picker, Text, View } from '@tarojs/components';
import { AtAvatar, AtButton, AtForm, AtInput } from 'taro-ui';
import { ListItem } from '@/components';
import styles from './index.module.scss';

export default function () {
    /* ------------------------------ 头部：金额 ------------------------------ */
    const [account, setAccount] = useState<string>('');

    /* ------------------------------ 头部：类别 ------------------------------ */
    const [typeList, setTypeList] = useState([
        { id: 1, name: '工资' },
        { id: 2, name: '奖金' },
    ]);
    const typeNames = typeList.map(item => item.name);
    const [typeIndex, setTypeIndex] = useState<number>();

    return (
        <View className='account'>
            <View className={`${styles.banner} flex justify-center items-center`}>
                <AtAvatar circle image={require('@/images/kirby-1.jpeg')} size='large' />
            </View>
            {typeIndex}
            <AtForm className={styles.form} onSubmit={e => console.log(e)}>
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
                    name='type'
                    value={typeIndex}
                    range={typeNames}
                    onChange={e => setTypeIndex(e.detail.value as number)}
                >
                    {/* <AtList hasBorder={false}> */}
                    <ListItem title='类别' placeholder='请选择类别' arrow='right' />
                    {/* </AtList> */}
                </Picker>
                <Picker mode='date' name='date' value='2021-11-11' onChange={e => e}>
                    <ListItem
                        title='日期'
                        placeholder='请选择日期'
                        arrow='right'
                        hasBorder={false}
                    />
                </Picker>
                <View className='mt-16 px-8'>
                    <AtButton type='primary' formType='submit'>
                        提交
                    </AtButton>
                </View>
            </AtForm>
        </View>
    );
}
