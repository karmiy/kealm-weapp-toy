import { Text, View } from '@tarojs/components';
import { classnames } from '@/utils/base';
import styles from './index.module.scss';

export default function () {
    console.log('styles', styles, classnames);

    return (
        <View className={`${styles.wrapper} flex-1`}>
            <View className='k'>detail</View>
            <View className={styles.content}>
                <Text className={styles.a}>1</Text>
            </View>
            <View className={styles.info}>
                <Text className={styles.a}>1</Text>
            </View>
        </View>
    );
}
