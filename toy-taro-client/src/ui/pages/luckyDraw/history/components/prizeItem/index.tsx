import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import { FallbackImage } from '@ui/components';
import styles from './index.module.scss';

interface PrizeItemProps {
  id: string;
  line?: boolean;
}
export function PrizeItem(props: PrizeItemProps) {
  const { id, line = true } = props;

  return (
    <View className={clsx(styles.prizeItemWrapper, { [styles.line]: line })}>
      <FallbackImage
        className={styles.coverImg}
        src='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-red-envelop.png'
      />
      <View className={styles.contentWrapper}>
        <View className={styles.title}>5折券({id})</View>
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
