import { useState } from 'react';
import { View } from '@tarojs/components';
import { format, getMonth, getYear, parseISO } from 'date-fns';
import { Picker } from '@/components';
import { HeaderItem } from './components';
import { getIntegerAndDecimal } from './utils';
import styles from './index.module.scss';

export default function () {
    /* ------------------------------ 头部：日期 ------------------------------ */
    const [dateStr, setDateStr] = useState(format(new Date(), 'yyyy-MM-dd'));
    const date = parseISO(dateStr);
    const year = getYear(date);
    const month = getMonth(date) + 1;

    const renderDateHeader = () => {
        return (
            <Picker
                mode='date'
                fields='month'
                value={dateStr}
                onChange={e => setDateStr(e.detail.value)}
                render={visible => {
                    return (
                        <HeaderItem
                            label={`${year}年`}
                            strong={`${month}`.padStart(2, '0')}
                            secondary='月'
                            showSelect
                            isSelect={visible}
                        />
                    );
                }}
            />
        );
    };

    /* ------------------------------ 头部：收入 ------------------------------ */
    const [income, setIncome] = useState(0);
    const renderIncomeHeader = () => {
        const [integer, decimal] = getIntegerAndDecimal(income);
        return <HeaderItem label='收入' strong={integer} secondary={`.${decimal}`} />;
    };

    /* ------------------------------ 头部： 支出 ------------------------------ */
    const [expenditure, setExpenditure] = useState(0);
    const renderExpenditureHeader = () => {
        const [integer, decimal] = getIntegerAndDecimal(expenditure);
        return <HeaderItem label='支出' strong={integer} secondary={`.${decimal}`} />;
    };

    return (
        <View className='flex flex-col h-full'>
            <View className={`${styles.header} flex items-center`}>
                {renderDateHeader()}
                {renderIncomeHeader()}
                {renderExpenditureHeader()}
            </View>
            <View className='flex-1 bg-red-300' />
        </View>
    );
}
