import { Text, View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { AtAvatar, AtList } from 'taro-ui';
import { ListItem } from '@/components';
import { getUserAccountStatistics } from '@/services';
import { useUserInfoStore } from '@/store';
import { navigateToPage } from '@/utils/utils';
import { BASE_FUNC_LIST } from './utils';
import styles from './index.module.scss';

export default function () {
    const { userInfo, applyForUserInfo } = useUserInfoStore();

    const { data: statistics, run } = useRequest(
        async () => {
            const { data } = await getUserAccountStatistics();
            return {
                usageDays: data.usage_days,
                accountDays: data.account_days,
                accountCount: data.account_count,
            };
        },
        {
            manual: true,
        },
    );

    useDidShow(() => {
        run();
    });

    return (
        <View className='mine bg-neutral-12 h-full'>
            <View
                className={`${styles.header} flex flex-col justify-center items-center pt-8 pb-16`}
            >
                <View onClick={applyForUserInfo}>
                    <AtAvatar
                        circle
                        image={
                            userInfo.avatarUrl ??
                            'https://gitee.com/karmiy/static/raw/master/weapp-accounts/imgs/kirby-1.jpeg'
                        }
                        size='large'
                    />
                </View>
                <Text className={`${styles.nickname} mt-4`}>{userInfo.nickName ?? '小卡比'}</Text>
                <View className={`${styles.stat} w-full flex items-center justify-around`}>
                    <View className='flex flex-col items-center'>
                        <Text className={`${styles.count} mt-4`}>{statistics?.usageDays ?? 0}</Text>
                        <Text className={styles.title}>使用天数</Text>
                    </View>
                    <View className='flex flex-col items-center'>
                        <Text className={`${styles.count} mt-4`}>
                            {statistics?.accountDays ?? 0}
                        </Text>
                        <Text className={styles.title}>记账天数</Text>
                    </View>
                    <View className='flex flex-col items-center'>
                        <Text className={`${styles.count} mt-4`}>
                            {statistics?.accountCount ?? 0}
                        </Text>
                        <Text className={styles.title}>记账笔数</Text>
                    </View>
                </View>
            </View>
            <AtList className='mt-8' hasBorder={false}>
                {BASE_FUNC_LIST.map((item, index) => {
                    const isLast = index === BASE_FUNC_LIST.length - 1;
                    return (
                        <ListItem
                            key={item.label}
                            title='图表统计'
                            arrow='right'
                            hasBorder={!isLast}
                            thumb={item.icon}
                            onClick={() => navigateToPage({ pageName: item.navigate })}
                        />
                    );
                })}
            </AtList>
        </View>
    );
}
