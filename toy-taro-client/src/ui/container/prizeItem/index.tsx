import { useMemo } from 'react';
import { View } from '@tarojs/components';
import clsx from 'clsx';
import { PRIZE_TYPE } from '@core';
import { Icon } from '@ui/components';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import styles from './index.module.scss';

export interface PrizeItemProps {
  classes?: {
    root?: string;
    sortIconWrapper?: string;
  };
  transparent?: boolean;
  gray?: boolean;
  type?: PRIZE_TYPE;
  prizeTitle?: string;
  prizeDesc?: string;
  range?: number;
  totalRange?: number;
  editable?: boolean;
  deletable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PrizeItem(props: PrizeItemProps) {
  const {
    classes,
    transparent = false,
    gray = false,
    type,
    prizeTitle,
    prizeDesc,
    range,
    totalRange,
    editable = true,
    deletable = true,
    onEdit,
    onDelete,
  } = props;

  const title = useMemo(() => {
    if (type === PRIZE_TYPE.POINTS) {
      return prizeTitle ?? '积分奖励';
    }
    if (type === PRIZE_TYPE.COUPON) {
      return prizeTitle ?? '优惠券奖励';
    }
    if (type === PRIZE_TYPE.LUCKY_DRAW) {
      return prizeTitle ?? '祈愿券奖励';
    }
    if (type === PRIZE_TYPE.NONE) {
      return prizeTitle ?? '谢谢惠顾';
    }
    return '谢谢惠顾';
  }, [type, prizeTitle]);

  const desc = useMemo(() => {
    if (
      type === PRIZE_TYPE.POINTS ||
      type === PRIZE_TYPE.COUPON ||
      type === PRIZE_TYPE.LUCKY_DRAW ||
      type === PRIZE_TYPE.NONE
    ) {
      return prizeDesc;
    }
    return '无奖品';
  }, [type, prizeDesc]);

  const rate = useMemo(() => {
    if (!totalRange) {
      return 0;
    }
    return Math.round(((range ?? 0) / totalRange) * 100);
  }, [range, totalRange]);

  return (
    <View
      className={clsx(
        styles.prizeItemWrapper,
        { [styles.isTransparent]: transparent },
        { [styles.isGray]: gray },
        classes?.root,
      )}
    >
      <View className={clsx(styles.sortIconWrapper, classes?.sortIconWrapper)}>
        <Icon name='sort' size={16} color={COLOR_VARIABLES.TEXT_COLOR_SECONDARY} />
      </View>
      {/* 用 image 排序后会闪烁出排序前的那张图，应该是因为 image 会有缓存之前的图片 */}
      {/* <FallbackImage className={styles.coverImg} src={PRIZE_COVER_IMG[type]} /> */}
      <View
        className={clsx(styles.coverImg, {
          [styles.isPoints]: type === PRIZE_TYPE.POINTS,
          [styles.isCoupon]: type === PRIZE_TYPE.COUPON,
          [styles.isDraw]: type === PRIZE_TYPE.LUCKY_DRAW,
          [styles.isNone]: !type || type === PRIZE_TYPE.NONE,
        })}
      />
      <View className={styles.contentWrapper}>
        <View className={styles.title}>{title}</View>
        <View className={styles.desc}>{desc}</View>
        {rate ? (
          <View className={styles.tip}>
            权重值:{range} (中奖率:{rate}%)
          </View>
        ) : null}
      </View>
      <View className={styles.actionWrapper}>
        {editable ? (
          <View className={styles.item} onClick={onEdit}>
            <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} size={14} />
          </View>
        ) : null}
        {deletable ? (
          <View className={styles.item} onClick={onDelete}>
            <Icon name='delete' color={COLOR_VARIABLES.COLOR_RED} size={14} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
