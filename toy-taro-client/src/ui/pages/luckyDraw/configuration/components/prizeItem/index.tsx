import { useMemo } from 'react';
import { View } from '@tarojs/components';
import clsx from 'clsx';
import { STORE_NAME } from '@core';
import { FallbackImage, Icon } from '@ui/components';
import { useStoreById } from '@ui/viewModel';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import { PRIZE_COVER_IMG, PRIZE_TYPE } from '../../constants';
import styles from './index.module.scss';

export interface PrizeItemProps {
  type: PRIZE_TYPE;
  points?: number;
  couponId?: string;
  range?: number;
  totalRange?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PrizeItem(props: PrizeItemProps) {
  const { type, points, couponId, range, totalRange, onEdit, onDelete } = props;
  const coupon = useStoreById(STORE_NAME.COUPON, couponId);

  const title = useMemo(() => {
    if (type === PRIZE_TYPE.POINTS) {
      return '积分奖励';
    }
    if (type === PRIZE_TYPE.COUPON) {
      return coupon?.name ?? '优惠券奖励';
    }
    return '谢谢惠顾';
  }, [type, coupon]);

  const desc = useMemo(() => {
    if (type === PRIZE_TYPE.POINTS) {
      return `${points ?? 0}积分`;
    }
    if (type === PRIZE_TYPE.COUPON) {
      return coupon?.descriptionTip;
    }
    return '无奖品';
  }, [type, points, coupon]);

  const rate = useMemo(() => {
    if (!totalRange) {
      return 0;
    }
    return Math.round(((range ?? 0) / totalRange) * 100);
  }, [range, totalRange]);

  return (
    <View className={styles.prizeItemWrapper}>
      <View className={styles.sortIconWrapper}>
        <Icon name='sort' size={16} color={COLOR_VARIABLES.TEXT_COLOR_SECONDARY} />
      </View>
      {/* 用 image 排序后会闪烁出排序前的那张图，应该是因为 image 会有缓存之前的图片 */}
      {/* <FallbackImage className={styles.coverImg} src={PRIZE_COVER_IMG[type]} /> */}
      <View
        className={clsx(styles.coverImg, {
          [styles.isPoints]: type === PRIZE_TYPE.POINTS,
          [styles.isCoupon]: type === PRIZE_TYPE.COUPON,
          [styles.isNone]: type === PRIZE_TYPE.NONE,
        })}
      />
      <View className={styles.contentWrapper}>
        <View className={styles.title}>{title}</View>
        <View className={styles.desc}>{desc}</View>
        <View className={styles.tip}>
          权重值:{range} (中奖率:{rate}%)
        </View>
      </View>
      <View className={styles.actionWrapper}>
        <View className={styles.item} onClick={onEdit}>
          <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} size={14} />
        </View>
        <View className={styles.item} onClick={onDelete}>
          <Icon name='delete' color={COLOR_VARIABLES.COLOR_RED} size={14} />
        </View>
      </View>
    </View>
  );
}
