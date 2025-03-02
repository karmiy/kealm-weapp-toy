import { useMemo } from 'react';
import { CouponModel, STORE_NAME } from '@core';
import { useStoreList } from '../base';
import { getNormalCouponInfo } from './utils';

export function useCouponList() {
  // 预留，可能后续要划分有效无效（删除）优惠券
  const activeCouponModels = useStoreList(STORE_NAME.COUPON);

  const activeCoupons = useMemo(() => {
    return activeCouponModels.map(item => {
      return {
        ...item,
        ...getNormalCouponInfo(item),
      };
    });
  }, [activeCouponModels]);

  const couponDict = useMemo(() => {
    const dict = new Map<string, CouponModel>();
    activeCouponModels.forEach(item => {
      dict.set(item.id, item);
    });
    return dict;
  }, [activeCouponModels]);

  return {
    activeCoupons,
    couponDict,
  };
}
