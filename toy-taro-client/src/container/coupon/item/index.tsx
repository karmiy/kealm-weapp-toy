import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import styles from './index.module.scss';

interface CouponItemProps {
  score: number;
  condition: string;
  title: string;
  range: string;
  period: string;
  disabled?: boolean;
  onClick?: () => void;
}

const CouponItem = (props: CouponItemProps) => {
  const { score, condition, title, range, period, disabled, onClick } = props;

  const handleClick = () => {
    if (disabled) {
      return;
    }
    onClick?.();
  };

  return (
    <View className={clsx(styles.wrapper, { [styles.isDisabled]: disabled })} onClick={handleClick}>
      <View className={styles.scoreWrapper}>
        <Text className={styles.score}>{score}</Text>
        <Text className={styles.condition}>{condition}</Text>
      </View>
      <View className={styles.info}>
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.subTitle}>{range}</Text>
        <Text className={styles.subTitle}>有效期至：{period}</Text>
      </View>
    </View>
  );
};

export { CouponItem, CouponItemProps };
