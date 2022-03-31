import { Text, View } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';
import { useUserInfoStore } from '@/store';
import styles from './index.module.scss';

export default function () {
    const { userInfo } = useUserInfoStore();

    return (
        <View className='mine'>
            <View
                className={`${styles.header} flex flex-col justify-center items-center pt-8 pb-16`}
            >
                <AtAvatar
                    circle
                    image={
                        userInfo.avatarUrl ??
                        'https://gitee.com/karmiy/static/raw/master/weapp-accounts/imgs/kirby-1.jpeg'
                    }
                    size='large'
                />
                <Text className={`${styles.nickname} mt-4`}>{userInfo.nickName ?? '小卡比'}</Text>
                <View className={`${styles.stat} w-full flex items-center justify-around`}>
                    <View className='flex flex-col items-center'>
                        <Text className={`${styles.count} mt-4`}>0</Text>
                        <Text className={styles.title}>使用天数</Text>
                    </View>
                    <View className='flex flex-col items-center'>
                        <Text className={`${styles.count} mt-4`}>0</Text>
                        <Text className={styles.title}>记账天数</Text>
                    </View>
                    <View className='flex flex-col items-center'>
                        <Text className={`${styles.count} mt-4`}>0</Text>
                        <Text className={styles.title}>记账笔数</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
