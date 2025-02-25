import { useCallback, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { PRIZE_TYPE, STORE_NAME } from '@core';
import { Button, CheckButton, Icon, Input, PickerSelector, WhiteSpace } from '@ui/components';
import { PrizeItem as StyledPrizeItem } from '@ui/container';
import { useCoupon, useStoreById } from '@ui/viewModel';
import styles from './index.module.scss';

interface PrizeItemProps {
  id?: string;
}

export const PrizeItem = (props: PrizeItemProps) => {
  const { id } = props;
  const prize = useStoreById(STORE_NAME.PRIZE, id);
  const coupon = useStoreById(STORE_NAME.COUPON, prize?.couponId);

  const prizeDesc = useMemo(() => {
    if (!prize) {
      return '';
    }
    const { type, points } = prize;
    if (type === PRIZE_TYPE.POINTS && points) {
      return `${points}积分`;
    }
    if (type === PRIZE_TYPE.COUPON && coupon) {
      return coupon.descriptionTip;
    }
    return '';
  }, [prize, coupon]);

  if (!prize) {
    return null;
  }

  return (
    <StyledPrizeItem
      classes={{
        root: styles.prizeItemWrapper,
      }}
      transparent
      type={prize.type}
      prizeTitle={prize.prizeTitle}
      prizeDesc={prizeDesc}
      editable={false}
      deletable={false}
    />
  );
};
