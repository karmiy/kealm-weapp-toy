import { Text, View } from '@tarojs/components';
import { classnames } from '@/utils/base';
import styles from './index.module.scss';

export default function () {
    return (
        <View>
            <View className={`${styles.header} flex items-center`}>
                <View className='flex flex-col items-center px-16 py-12'>
                    <Text className={styles.label}>2022年</Text>
                    <View className='mt-8'>
                        <Text className={styles.strong}>03</Text>
                        <Text className={styles.secondary}>月</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
