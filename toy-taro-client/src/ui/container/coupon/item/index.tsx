import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import styles from './index.module.scss';

export interface CouponItemProps {
  id: string;
  type?: 'selectable' | 'unselectable' | 'used' | 'expired';
  discountTip: string;
  conditionTip: string;
  name: string;
  usageScopeTip: string;
  expirationTip: string;
  selected?: boolean;
  onClick?: (id: string) => void;
}

const CouponItem = (props: CouponItemProps) => {
  const {
    id,
    type = 'selectable',
    discountTip,
    conditionTip,
    name,
    usageScopeTip,
    expirationTip,
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
        <Text className={styles.score}>{discountTip}</Text>
        <Text className={styles.condition}>{conditionTip}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.info}>
          <Text className={styles.title}>{name}</Text>
          <Text className={styles.subTitle}>{usageScopeTip}</Text>
          <Text className={styles.subTitle}>{expirationTip}</Text>
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
