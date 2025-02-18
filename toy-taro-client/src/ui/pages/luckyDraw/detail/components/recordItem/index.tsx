import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import { FallbackImage } from '@ui/components';
import styles from './index.module.scss';

interface RecordItemProps {
  line?: boolean;
}
export function RecordItem(props: RecordItemProps) {
  const { line = true } = props;

  return (
    <View className={clsx(styles.recordItemWrapper, { [styles.line]: line })}>
      <FallbackImage
        className={styles.coverImg}
        src='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-red-envelop.png'
      />
      <View className={styles.contentWrapper}>
        <View className={styles.title}>5折券</View>
        <View className={styles.secondary}>
          <Text>祈愿人:</Text>
          <Text>洪以妍</Text>
        </View>
        <View className={styles.secondary}>
          <Text>祈愿时间:</Text>
          <Text>2024-01-20 15:30</Text>
        </View>
      </View>
    </View>
  );
}
