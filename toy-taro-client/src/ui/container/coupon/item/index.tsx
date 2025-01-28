import { useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import styles from './index.module.scss';

type CouponItemType = 'selectable' | 'unselectable' | 'used' | 'expired';

export type CouponRenderAction = (id: string, type: CouponItemType) => React.ReactNode;

export interface CouponItemProps {
  id: string;
  type?: CouponItemType;
  discountTip: string;
  conditionTip: string;
  name: string;
  usageScopeTip: string;
  expirationTip: string;
  selected?: boolean;
  onClick?: (id: string) => void;
  renderAction?: CouponRenderAction;
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
    renderAction,
  } = props;

  const handleClick = () => {
    if (type !== 'selectable') {
      return;
    }
    onClick?.(id);
  };

  const Action = useMemo(() => {
    return renderAction?.(id, type);
  }, [renderAction, id, type]);

  return (
    <View
      className={clsx(styles.wrapper, {
        [styles.isSelected]: selected,
        [styles.isUnSelectable]: type === 'unselectable',
        [styles.isUsed]: type === 'used',
        [styles.isExpired]: type === 'expired',
        [styles.isCustomAction]: !!renderAction,
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
        {Action ? (
          <View className={styles.customAction}>{Action}</View>
        ) : (
          <View className={styles.selectAction}>
            <View className={styles.outer}>
              <View className={styles.inner} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export { CouponItem };
