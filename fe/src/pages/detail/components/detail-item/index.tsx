import { useContext, useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { format, getDay, getWeek } from 'date-fns';
import { AtIcon } from 'taro-ui';
import { formatNumber } from '@/utils/base';
import { ACCOUNT_MODE, WEEK } from '@/utils/constants';
import { navigateToPage } from '@/utils/utils';
import { StatisticsContext } from '../../context';
import styles from './index.module.scss';

interface Props {
    dateGroupName: string;
    list: Array<{
        id: number;
        amount: number;
        createTime: number;
        remark?: string | undefined;
        accountType: {
            id: number;
            name: string;
            accountMode: ACCOUNT_MODE;
        };
    }>;
}

export default function (props: Props) {
    const { dateGroupName, list } = props;
    const date = useMemo(() => new Date(dateGroupName), [dateGroupName]);
    const { statistics } = useContext(StatisticsContext);
    const { income = 0, expenditure = 0 } = statistics?.[dateGroupName] ?? {};

    const navigateToEdit = (id: number) => {
        navigateToPage({
            pageName: `edit`,
            params: {
                id,
            },
        });
    };

    return (
        <View className={`${styles.detailItem}`}>
            <View className={`${styles.groupTitle} px-12 flex items-center justify-between`}>
                <Text>
                    {format(date, 'MM月dd日')} {WEEK[getDay(date)]}
                </Text>
                <View>
                    <Text>收入：{formatNumber(income)}</Text>
                    <Text className='ml-20'>支出：{formatNumber(expenditure)}</Text>
                </View>
            </View>
            {list.map(item => {
                const { id, amount, createTime, accountType } = item;

                return (
                    <View
                        key={id}
                        className={`${styles.groupItem} flex justify-between items-center mx-16 py-12`}
                        onClick={() => navigateToEdit(id)}
                    >
                        <View className='flex flex-col flex-1 overflow-hidden pr-8'>
                            {/* <Text className={styles.type}>{account.name}</Text> */}
                            <Text className={styles.type}>{accountType.name}</Text>
                            <Text className={styles.time}>{format(createTime, 'HH:mm')}</Text>
                        </View>
                        <View>
                            {accountType.accountMode === ACCOUNT_MODE.收入 ? (
                                <Text className={`${styles.account} text-primary`}>
                                    +{formatNumber(amount)}
                                </Text>
                            ) : (
                                <Text className={`${styles.account}`}>-{formatNumber(amount)}</Text>
                            )}
                            <AtIcon
                                className={`${styles.arrow} ml-8`}
                                value='chevron-right'
                                size={16}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
