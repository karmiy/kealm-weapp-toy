import { useEffect, useMemo, useState } from 'react';
import { reaction } from '@shared/utils/observer';
import { STORE_NAME } from '@core';
import { CouponController } from '@ui/controller';
import { useStoreByIds } from '../base';

interface Props {
  enableActiveIds?: boolean;
  enableUsedIds?: boolean;
  enableExpiredIds?: boolean;
  orderScore?: number;
}

export function useCoupon(props?: Props) {
  const {
    enableActiveIds = false,
    enableUsedIds = false,
    enableExpiredIds = false,
    orderScore,
  } = props ?? {};
  const [activeCouponIds, setActiveCouponIds] = useState<string[]>([]);
  const [usedCouponIds, setUsedCouponIds] = useState<string[]>([]);
  const [expiredCouponIds, setExpiredCouponIds] = useState<string[]>([]);
  const activeCouponModels = useStoreByIds(STORE_NAME.COUPON, activeCouponIds);
  const usedCouponModels = useStoreByIds(STORE_NAME.COUPON, usedCouponIds);
  const expiredCouponModels = useStoreByIds(STORE_NAME.COUPON, expiredCouponIds);

  useEffect(() => {
    if (!enableActiveIds) {
      return;
    }
    const disposer = reaction(
      () => CouponController.getInstance().activeCouponIds,
      setActiveCouponIds,
      {
        fireImmediately: true,
      },
    );
    return () => disposer();
  }, [enableActiveIds]);

  useEffect(() => {
    if (!enableUsedIds) {
      return;
    }
    const disposer = reaction(
      () => CouponController.getInstance().usedCouponIds,
      setUsedCouponIds,
      {
        fireImmediately: true,
      },
    );
    return () => disposer();
  }, [enableUsedIds]);

  useEffect(() => {
    if (!enableExpiredIds) {
      return;
    }
    const disposer = reaction(
      () => CouponController.getInstance().expiredCouponIds,
      setExpiredCouponIds,
      {
        fireImmediately: true,
      },
    );
    return () => disposer();
  }, [enableExpiredIds]);

  const activeCoupons = useMemo(() => {
    return activeCouponModels.map(coupon => {
      const discountInfo =
        typeof orderScore !== 'undefined'
          ? coupon.getDiscountInfo(orderScore)
          : { score: 0, enabled: true };
      return {
        ...coupon,
        discountTip: coupon.discountTip,
        usageScopeTip: coupon.usageScopeTip,
        conditionTip: coupon.conditionTip,
        expirationTip: coupon.expirationTip,
        type: discountInfo.enabled ? ('selectable' as const) : ('unselectable' as const),
        selectable: discountInfo.enabled,
        discountScore: discountInfo.score,
      };
    });
  }, [activeCouponModels, orderScore]);

  const usedCoupons = useMemo(() => {
    return usedCouponModels.map(coupon => {
      return {
        ...coupon,
        discountTip: coupon.discountTip,
        usageScopeTip: coupon.usageScopeTip,
        conditionTip: coupon.conditionTip,
        expirationTip: coupon.expirationTip,
        type: 'used' as const,
      };
    });
  }, [usedCouponModels]);

  const expiredCoupons = useMemo(() => {
    return expiredCouponModels.map(coupon => {
      return {
        ...coupon,
        discountTip: coupon.discountTip,
        usageScopeTip: coupon.usageScopeTip,
        conditionTip: coupon.conditionTip,
        expirationTip: coupon.expirationTip,
        type: 'expired' as const,
      };
    });
  }, [expiredCouponModels]);

  return {
    activeCouponIds,
    usedCouponIds,
    expiredCouponIds,
    activeCoupons,
    usedCoupons,
    expiredCoupons,
  };
}
