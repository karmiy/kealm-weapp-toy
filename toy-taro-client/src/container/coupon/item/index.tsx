import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import styles from './index.module.scss';

export interface CouponItemProps {
  id: string;
  type?: 'selectable' | 'unselectable' | 'used' | 'expired';
  score: number;
  condition: string;
  title: string;
  range: string;
  period: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (id: string) => void;
}

const CouponItem = (props: CouponItemProps) => {
  const {
    id,
    type = 'selectable',
    score,
    condition,
    title,
    range,
    period,
    selected,
    onClick,
  } = props;

  const handleClick = () => {
    if (type !== 'selectable') {
      return;
    }
    onClick?.(id);
  };

  return (
    <View
      className={clsx(styles.wrapper, {
        [styles.isSelected]: selected,
        [styles.isUnSelectable]: type === 'unselectable',
        [styles.isUsed]: type === 'used',
        [styles.isExpired]: type === 'expired',
      })}
      onClick={handleClick}
    >
      <View className={styles.scoreWrapper}>
        <Text className={styles.score}>{score}</Text>
        <Text className={styles.condition}>{condition}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.info}>
          <Text className={styles.title}>{title}</Text>
          <Text className={styles.subTitle}>{range}</Text>
          <Text className={styles.subTitle}>有效期至：{period}</Text>
        </View>
        <View className={styles.action}>
          <View className={styles.outer}>
            <View className={styles.inner} />
          </View>
        </View>
      </View>
    </View>
  );
};

export { CouponItem };
