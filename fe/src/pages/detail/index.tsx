import { useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { format, getMonth, getYear, parseISO } from 'date-fns';
import { AtLoadMore } from 'taro-ui';
import { Picker } from '@/components';
import { DetailItem, HeaderItem } from './components';
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
            <View className={`${styles.list} flex-1 overflow-hidden`}>
                <ScrollView className='h-full' scrollY>
                    <DetailItem />
                    <DetailItem />
                    <DetailItem />
                    <AtLoadMore
                        className={styles.loadMore}
                        status='noMore'
                        noMoreText='没有更多啦~'
                    />
                </ScrollView>
            </View>
        </View>
    );
}
