import { useMemo } from 'react';
import { CouponModel, STORE_NAME } from '@core';
import { useStoreList } from '../base';
import { getNormalCouponInfo } from './utils';

export function useCouponList() {
  // 预留，可能后续要划分有效无效（删除）优惠券
  const allCouponModels = useStoreList(STORE_NAME.COUPON);

  const allCoupons = useMemo(() => {
    return allCouponModels.map(item => {
      return {
        ...item,
        ...getNormalCouponInfo(item),
      };
    });
  }, [allCouponModels]);

  const activeCoupons = useMemo(() => {
    return allCoupons.filter(item => !item.isExpired);
  }, [allCoupons]);

  const couponDict = useMemo(() => {
    const dict = new Map<string, CouponModel>();
    allCouponModels.forEach(item => {
      dict.set(item.id, item);
    });
    return dict;
  }, [allCouponModels]);

  return {
    allCouponModels,
    activeCoupons,
    couponDict,
  };
}
