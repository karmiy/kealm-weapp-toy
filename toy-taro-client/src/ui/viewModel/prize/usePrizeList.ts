import { useMemo } from 'react';
import { STORE_NAME } from '@core';
import { useStoreList } from '../base';
import { useCouponList } from '../coupon';
import { getPrizeDetailDesc, getPrizeShortDesc } from './utils';

export function usePrizeList() {
  const { couponDict } = useCouponList();
  const prizeList = useStoreList(STORE_NAME.PRIZE);
  const activePrizeList = useMemo(() => {
    return prizeList.map(item => {
      const coupon = item.couponId ? couponDict.get(item.couponId) : undefined;
      return {
        ...item,
        detailDesc: getPrizeDetailDesc(item, coupon),
        shortDesc: getPrizeShortDesc(item, coupon),
      };
    });
  }, [couponDict, prizeList]);

  return {
    activePrizeList,
  };
}
