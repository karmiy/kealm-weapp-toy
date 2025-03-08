import { useMemo } from 'react';
import { STORE_NAME } from '@core';
import { useStoreById } from '../base';
import { getPrizeDesc } from './utils';

export function usePrizeItem(id?: string) {
  const prizeModel = useStoreById(STORE_NAME.PRIZE, id);
  const coupon = useStoreById(STORE_NAME.COUPON, prizeModel?.couponId);

  const prize = useMemo(() => {
    if (!prizeModel) {
      return;
    }
    const { title } = prizeModel;
    return {
      ...prizeModel,
      // get 无法被 ... 解构，只能如 const { title } = prizeModel
      title,
      detailDesc: getPrizeDesc({
        prize: prizeModel,
        coupon,
        descLevel: 'detail',
      }),
      shortDesc: getPrizeDesc({
        prize: prizeModel,
        coupon,
        descLevel: 'short',
      }),
      terseDesc: getPrizeDesc({
        prize: prizeModel,
        coupon,
        descLevel: 'terse',
      }),
    };
  }, [prizeModel, coupon]);

  return prize;
}
