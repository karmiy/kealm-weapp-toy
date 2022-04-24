import { useMemo, useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { getStorageSync, removeStorage, useDidShow } from '@tarojs/taro';
import { useRequest, useUpdateEffect } from 'ahooks';
import { format, getMonth, getYear, parseISO } from 'date-fns';
import { AtLoadMore } from 'taro-ui';
import { Picker } from '@/components';
import { useLoadMore, useRefresh } from '@/hooks';
import { getRecords, getStatistics } from '@/services';
import { ACCOUNT_MODE, STORAGE_KEYS } from '@/utils/constants';
import { DetailItem, HeaderItem } from './components';
import { StatisticsContext } from './context';
import { getIntegerAndDecimal } from './utils';
import styles from './index.module.scss';

interface AccountRecord {
    id: number;
    amount: number;
    createTime: number;
    remark?: string | undefined;
    accountType: {
        id: number;
        name: string;
        accountMode: ACCOUNT_MODE;
    };
}

export default function () {
    /* ------------------------------ 头部：日期 ------------------------------ */
    const [dateStr, setDateStr] = useState(() => format(new Date(), 'yyyy-MM-dd'));
    // const [dateStr, setDateStr] = useState('2022-03-31');
    const date = parseISO(dateStr);
    const year = getYear(date);
    const month = getMonth(date) + 1;

    const renderDateHeader = () => {
        return (
            <Picker
                className='flex-shrink-0'
                mode='date'
                fields='month'
                value={dateStr}
                onChange={e => {
                    // setDateStr(`${e.detail.value}-01`);
                    setDateStr(e.detail.value);
                }}
                render={visible => {
                    return (
                        <HeaderItem
                            className={styles.dateSelect}
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

    /* ------------------------------ 收支统计 ------------------------------ */
    const { data: statistics, run: refreshStatistics } = useRequest(async () => {
        const res = await getStatistics({ year, month });
        return res.data;
    });

    /* ------------------------------ 列表上拉加载 ------------------------------ */
    const [total, setTotal] = useState(0);
    const {
        list: accountRecordList,
        refresh: refreshAccountRecordList,
        onScrollToLower,
        loadAll,
    } = useLoadMore(
        async ({ pageNo }) => {
            const res = await getRecords({ year, month, page_no: pageNo });

            const { count, rows } = res.data;
            if (pageNo === 1) setTotal(count);

            return rows;
        },
        {
            isLoadAll: (currentList, loading) => {
                if (loading) return false;

                return currentList.length >= total;
            },
        },
    );

    const accountRecordGroups = useMemo(() => {
        const groups: Record<string, Array<AccountRecord>> = Object.create(null);

        accountRecordList.forEach(item => {
            const { id, amount, create_time, remark, account_type } = item;
            const key = format(create_time, 'yyyy-MM-dd');
            const list = groups[key] ?? [];

            list.push({
                id,
                amount,
                createTime: create_time,
                remark,
                accountType: {
                    id: account_type.id,
                    name: account_type.name,
                    accountMode: account_type.account_mode,
                },
            });
            groups[key] = list;
        });
        return groups;
    }, [accountRecordList]);

    /* ------------------------------ 页面刷新行为 ------------------------------ */
    const handleRefresh = () => {
        return Promise.all([refreshAccountRecordList(), refreshStatistics()]);
    };

    /* ------------------------------ 列表下拉刷新 ------------------------------ */
    const { refresherTriggered, onRefresherRefresh } = useRefresh(async () => {
        await handleRefresh();
    });

    /* ------------------------------ 跳转进入页面刷新列表 ------------------------------ */
    useDidShow(() => {
        const { refresh = false } = getStorageSync(STORAGE_KEYS.NAVIGATE_TO_DETAIL);
        removeStorage({
            key: STORAGE_KEYS.NAVIGATE_TO_DETAIL,
        });

        if (refresh) {
            handleRefresh();
        }
    });

    /* ------------------------------ 切换年月 ------------------------------ */
    useUpdateEffect(() => {
        handleRefresh();
    }, [year, month]);

    /* ------------------------------ 头部：总收支 ------------------------------ */
    const { income, expenditure } = useMemo(() => {
        if (!statistics) return { income: 0, expenditure: 0 };

        return Object.values(statistics).reduce(
            (s, item) => {
                s.income += item.income;
                s.expenditure += item.expenditure;
                return s;
            },
            { income: 0, expenditure: 0 },
        );
    }, [statistics]);

    /* ------------------------------ 头部：收入 ------------------------------ */
    const renderIncomeHeader = () => {
        const [integer, decimal] = getIntegerAndDecimal(income);
        return <HeaderItem label='收入' strong={integer} secondary={`.${decimal}`} />;
    };

    /* ------------------------------ 头部： 支出 ------------------------------ */
    const renderExpenditureHeader = () => {
        const [integer, decimal] = getIntegerAndDecimal(expenditure);
        return <HeaderItem label='支出' strong={integer} secondary={`.${decimal}`} />;
    };

    return (
        <StatisticsContext.Provider value={{ statistics }}>
            <View className='flex flex-col h-full'>
                {/* <View className={`${styles.header} flex items-center`}>{renderDateHeader()}</View> */}
                <View className={`${styles.header} flex items-center`}>
                    {renderDateHeader()}
                    {renderIncomeHeader()}
                    {renderExpenditureHeader()}
                </View>
                <View className={`${styles.list} flex-1 overflow-hidden`}>
                    <ScrollView
                        className='h-full'
                        scrollY
                        onScrollToLower={onScrollToLower}
                        refresherEnabled
                        onRefresherRefresh={onRefresherRefresh}
                        refresherTriggered={refresherTriggered}
                    >
                        {Object.keys(accountRecordGroups).map(dateGroupName => {
                            const list = accountRecordGroups[dateGroupName];

                            return (
                                <DetailItem
                                    key={dateGroupName}
                                    dateGroupName={dateGroupName}
                                    list={list}
                                />
                            );
                        })}
                        <AtLoadMore
                            className={styles.loadMore}
                            status={loadAll ? 'noMore' : 'loading'}
                            noMoreText='没有更多啦~'
                        />
                    </ScrollView>
                </View>
            </View>
        </StatisticsContext.Provider>
    );
}
