import { useState } from 'react';
import { Picker, Text, View } from '@tarojs/components';
import { HeaderItem } from './components';
import styles from './index.module.scss';

export default function () {
    /* ------------------------------ 头部：日期 ------------------------------ */
    const [dateStr, setDateStr] = useState('');
    const [dateVisible, setDateVisible] = useState(false);

    const renderDateHeader = () => {
        return (
            <Picker
                mode='date'
                onClick={() => setDateVisible(true)}
                onCancel={() => setDateVisible(false)}
                value={dateStr}
                onChange={e => {
                    setDateVisible(false);
                    setDateStr(e.detail.value);
                }}
            >
                <HeaderItem
                    label='2022年'
                    strong='03'
                    secondary='月'
                    showSelect
                    isSelect={dateVisible}
                />
            </Picker>
        );
    };

    /* ------------------------------ 头部：收入 ------------------------------ */
    const renderIncomeHeader = () => {
        return <HeaderItem label='收入' strong='5000' secondary='.00' />;
    };

    return (
        <View>
            <View className={`${styles.header} flex items-center`}>
                {renderDateHeader()}
                {renderIncomeHeader()}
            </View>
        </View>
    );
}
