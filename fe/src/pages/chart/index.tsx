import { useMemo, useState } from 'react';
import { BaseEventOrig, PickerDateProps, Text, View } from '@tarojs/components';
import { showToast } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { format, parseISO } from 'date-fns';
import { AtIcon, AtProgress, AtTag } from 'taro-ui';
import { Picker } from '@/components';
import { getStatistics, getTypeExpenditureStatistics } from '@/services';
import { add, asyncWrapper, division, multiplication } from '@/utils/base';
import { ECharts } from './components';
import { CHART_TYPE } from './constants';
import { createChartOptions } from './utils';
import styles from './index.module.scss';

export default function () {
    /* ------------------------------ 日期 & 类型 ------------------------------ */
    const [dateStr, setDateStr] = useState(() => format(new Date(), 'yyyy-MM-dd'));
    const date = useMemo(() => parseISO(dateStr), [dateStr]);
    const onDateChange = (e: BaseEventOrig<PickerDateProps.ChangeEventDetail>) => {
        if (chartType === CHART_TYPE.MONTH) {
            setDateStr(format(new Date(e.detail.value), 'yyyy-MM-dd'));
            return;
        }
        const nextDate = new Date(date);
        nextDate.setFullYear(Number(e.detail.value));
        setDateStr(format(nextDate, 'yyyy-MM-dd'));
    };
    const [chartType, setChartType] = useState<CHART_TYPE>(CHART_TYPE.MONTH);

    /* ------------------------------ Chart 配置 ------------------------------ */
    const [options, setOptions] = useState<Record<string, any>>({});

    /* ------------------------------ 支出排行 ------------------------------ */
    const [expendituresRank, setExpendituresRank] = useState<
        Array<{
            id: number;
            name: string;
            expenditure: number;
            percent: number;
        }>
    >();
    const expendituresRankSize = expendituresRank?.length;

    /* ------------------------------ Request ------------------------------ */
    const requestStatistics = async () => {
        const { data } = await getStatistics({
            year: date.getFullYear(),
            month: chartType === CHART_TYPE.MONTH ? date.getMonth() + 1 : undefined,
        });
        return data;
    };

    const requestExpendituresRank = async () => {
        const { data } = await getTypeExpenditureStatistics({
            year: date.getFullYear(),
            month: chartType === CHART_TYPE.MONTH ? date.getMonth() + 1 : undefined,
        });
        return data;
    };
    useRequest(
        async () => {
            const [res, err] = await asyncWrapper(
                Promise.all([requestStatistics(), requestExpendituresRank()]),
            );
            if (err || !res) {
                showToast({
                    title: '请求失败',
                    icon: 'error',
                });
            }
            const [statisticsData, expendituresData] = res as [
                Record<
                    string,
                    {
                        income: number;
                        expenditure: number;
                        total: number;
                    }
                >,
                Array<{ id: number; name: string; sum: number }>,
            ];

            // 更新图表
            setOptions(createChartOptions(date, chartType, statisticsData));

            // 更新支出排行
            const total = expendituresData.reduce((prev, cur) => {
                return add(prev, cur.sum);
            }, 0);
            setExpendituresRank(
                expendituresData.map(({ id, name, sum }) => {
                    return {
                        id,
                        name,
                        expenditure: sum,
                        percent:
                            total === 0
                                ? 0
                                : Math.max(
                                      Number(multiplication(division(sum, total), 100).toFixed(1)),
                                      0.01,
                                  ),
                    };
                }),
            );
        },
        {
            refreshDeps: [chartType, dateStr],
            debounceWait: 1000,
            debounceLeading: true,
        },
    );

    return (
        <View className='min-h-screen bg-neutral-12 overflow-hidden'>
            <View className='mx-12 my-8 bg-white rounded'>
                <View className='border-bottom px-16 py-12 flex items-center'>
                    <Text className='mr-8'>类型</Text>
                    <AtTag
                        className='mr-8'
                        active={chartType === CHART_TYPE.MONTH}
                        onClick={() => setChartType(CHART_TYPE.MONTH)}
                    >
                        按月
                    </AtTag>
                    <AtTag
                        active={chartType === CHART_TYPE.YEAR}
                        onClick={() => setChartType(CHART_TYPE.YEAR)}
                    >
                        按年
                    </AtTag>
                </View>
                <View className='px-16 py-12 flex items-center'>
                    <Text className='mr-8'>时间</Text>
                    <Picker
                        className='flex-shrink-0'
                        mode='date'
                        fields={chartType === CHART_TYPE.MONTH ? 'month' : 'year'}
                        value={dateStr}
                        onChange={onDateChange}
                        render={visible => {
                            return (
                                <View className={styles.chartDateSelect}>
                                    <Text>
                                        {format(
                                            date,
                                            chartType === CHART_TYPE.MONTH
                                                ? 'yyyy年MM月'
                                                : 'yyyy年',
                                        )}
                                    </Text>
                                    <AtIcon
                                        value={visible ? 'chevron-up' : 'chevron-down'}
                                        size={16}
                                    />
                                </View>
                            );
                        }}
                    />
                    {/* <View>
                        <Text>
                            {format(
                                selectedDate,
                                chartType === CHART_TYPE.MONTH ? 'yyyy年MM月' : 'yyyy年',
                            )}
                        </Text>
                        <AtIcon value='chevron-down' size={16} />
                    </View> */}
                </View>
            </View>
            <View className='mx-12 my-8 bg-white rounded'>
                <View className={styles.chartContainer}>
                    <ECharts options={options} />
                </View>
            </View>
            <View className='mx-12 my-8 bg-white rounded'>
                <View className='px-16 py-12'>
                    <View className='mb-8'>支出排行榜</View>
                    {expendituresRank?.map((item, index) => {
                        const { id, name, expenditure, percent } = item;
                        return (
                            <View
                                key={id}
                                className={`${styles.rankItem} py-12 ${
                                    index + 1 !== expendituresRankSize ? 'border-bottom' : ''
                                }`}
                            >
                                <View className='flex items-center justify-between mb-4'>
                                    <View className='flex items-center'>
                                        <Text className='mr-12'>{name}</Text>
                                        <Text>{percent}%</Text>
                                    </View>
                                    <Text>&yen;{expenditure}</Text>
                                </View>
                                <AtProgress percent={percent} isHidePercent />
                            </View>
                        );
                    })}
                </View>
            </View>
            <View className='h-8' />
        </View>
    );
}
