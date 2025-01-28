import { useCallback, useEffect, useMemo, useState } from 'react';
import { reaction } from '@shared/utils/observer';
import { showModal } from '@shared/utils/operateFeedback';
import { COUPON_STATUS, CouponModel, STORE_NAME } from '@core';
import { CouponController } from '@ui/controller';
import { useStoreByIds } from '../base';

interface Props {
  enableActiveIds?: boolean;
  enableUsedIds?: boolean;
  enableExpiredIds?: boolean;
  enableAllIds?: boolean;
  orderScore?: number;
}

export function useCoupon(props?: Props) {
  const {
    enableActiveIds = false,
    enableUsedIds = false,
    enableExpiredIds = false,
    enableAllIds = false,
    orderScore,
  } = props ?? {};
  const [activeCouponIds, setActiveCouponIds] = useState<string[]>([]);
  const [usedCouponIds, setUsedCouponIds] = useState<string[]>([]);
  const [expiredCouponIds, setExpiredCouponIds] = useState<string[]>([]);
  const [allCouponIds, setAllCouponIds] = useState<string[]>([]);
  const activeCouponModels = useStoreByIds(STORE_NAME.COUPON, activeCouponIds);
  const usedCouponModels = useStoreByIds(STORE_NAME.COUPON, usedCouponIds);
  const expiredCouponModels = useStoreByIds(STORE_NAME.COUPON, expiredCouponIds);
  const allCouponModels = useStoreByIds(STORE_NAME.COUPON, allCouponIds);

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

  useEffect(() => {
    if (!enableAllIds) {
      return;
    }
    const disposer = reaction(() => CouponController.getInstance().allCouponIds, setAllCouponIds, {
      fireImmediately: true,
    });
    return () => disposer();
  }, [enableAllIds]);

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

  const allCoupons = useMemo(() => {
    return allCouponModels.map(coupon => {
      const status = coupon.status;
      const type =
        status === COUPON_STATUS.ACTIVE
          ? coupon.isExpired
            ? ('expired' as const)
            : ('selectable' as const)
          : ('used' as const);
      return {
        ...coupon,
        discountTip: coupon.discountTip,
        usageScopeTip: coupon.usageScopeTip,
        conditionTip: coupon.conditionTip,
        expirationTip: coupon.expirationTip,
        type,
      };
    });
  }, [allCouponModels]);

  const handleDelete = useCallback(async (id: string) => {
    // [TODO] 删除前检测用户使用情况
    const feedback = await showModal({
      content: '确定要删除吗？',
    });
  }, []);

  return {
    activeCouponIds,
    usedCouponIds,
    expiredCouponIds,
    allCouponIds,
    activeCoupons,
    usedCoupons,
    expiredCoupons,
    allCoupons,
    handleDelete,
  };
}
