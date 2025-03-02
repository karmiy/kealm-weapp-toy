import { useMemo } from 'react';
import { CouponModel, STORE_NAME } from '@core';
import { useStoreList } from '../base';

export function useCouponList() {
  // 预留，可能后续要划分有效无效（删除）优惠券
  const activeCoupons = useStoreList(STORE_NAME.COUPON);

  const couponDict = useMemo(() => {
    const dict = new Map<string, CouponModel>();
    activeCoupons.forEach(item => {
      dict.set(item.id, item);
    });
    return dict;
  }, [activeCoupons]);

  return {
    activeCoupons,
    couponDict,
  };
}
