import { useCallback, useEffect, useMemo, useState } from 'react';
import { reaction } from '@shared/utils/observer';
import { COUPON_STATUS, COUPON_TYPE, CouponModel, sdk, STORE_NAME, UserCouponModel } from '@core';
import { UserCouponController } from '@ui/controller';
import { useStoreByIds } from '../base';
import { getNormalCouponInfo } from './utils';

interface Props {
  enableActiveIds?: boolean;
  enableUsedIds?: boolean;
  enableExpiredIds?: boolean;
  enableAllIds?: boolean;
  orderScore?: number;
  userId?: string;
}

type CommonCouponInfo = Pick<
  CouponModel,
  | 'id'
  | 'name'
  | 'createTime'
  | 'validityTime'
  | 'value'
  | 'minimumOrderValue'
  | 'discountTip'
  | 'usageScopeTip'
  | 'conditionTip'
  | 'expirationTip'
  | 'detailTip'
  | 'shortTip'
  | 'terseTip'
>;

type ActiveCoupon = CommonCouponInfo & {
  type: 'active';
  originalType: COUPON_TYPE;
  selectable: boolean;
  discountScore: number;
};

type UsedCoupon = CommonCouponInfo & {
  type: 'used';
  originalType: COUPON_TYPE;
};

type ExpiredCoupon = CommonCouponInfo & {
  type: 'expired';
  originalType: COUPON_TYPE;
};

type AllCoupon = CommonCouponInfo & {
  type: 'active' | 'used' | 'expired';
  originalType: COUPON_TYPE;
};

export function useUserCouponList(props?: Props) {
  const {
    enableActiveIds = false,
    enableUsedIds = false,
    enableExpiredIds = false,
    enableAllIds = false,
    orderScore,
    userId,
  } = props ?? {};
  const [activeCouponIds, setActiveCouponIds] = useState<string[]>([]);
  const [usedCouponIds, setUsedCouponIds] = useState<string[]>([]);
  const [expiredCouponIds, setExpiredCouponIds] = useState<string[]>([]);
  const [allCouponIds, setAllCouponIds] = useState<string[]>([]);
  const activeCouponModels = useStoreByIds(STORE_NAME.USER_COUPON, activeCouponIds);
  const usedCouponModels = useStoreByIds(STORE_NAME.USER_COUPON, usedCouponIds);
  const expiredCouponModels = useStoreByIds(STORE_NAME.USER_COUPON, expiredCouponIds);
  const allCouponModels = useStoreByIds(STORE_NAME.USER_COUPON, allCouponIds);

  useEffect(() => {
    if (!enableActiveIds) {
      return;
    }
    const disposer = reaction(
      () => UserCouponController.getInstance().activeCouponIds,
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
      () => UserCouponController.getInstance().usedCouponIds,
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
      () => UserCouponController.getInstance().expiredCouponIds,
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
    const disposer = reaction(
      () => UserCouponController.getInstance().allCouponIds,
      setAllCouponIds,
      {
        fireImmediately: true,
      },
    );
    return () => disposer();
  }, [enableAllIds]);

  const filterUserCoupon = useCallback(
    (list: UserCouponModel[]) => {
      if (!userId) {
        return list;
      }
      return list.filter(item => item.userId === userId);
    },
    [userId],
  );

  const activeCoupons = useMemo(() => {
    const list: ActiveCoupon[] = [];
    filterUserCoupon(activeCouponModels).forEach(userCoupon => {
      const coupon = sdk.storeManager.getById(STORE_NAME.COUPON, userCoupon.couponId);
      if (!coupon) {
        return;
      }
      const discountInfo =
        typeof orderScore !== 'undefined'
          ? coupon.getDiscountInfo(orderScore)
          : { score: 0, enabled: true };
      list.push({
        ...coupon,
        ...userCoupon,
        ...getNormalCouponInfo(coupon),
        type: 'active' as const,
        originalType: coupon.type,
        selectable: discountInfo.enabled,
        discountScore: discountInfo.score,
      });
    });
    return list;
  }, [activeCouponModels, orderScore, filterUserCoupon]);

  const usedCoupons = useMemo(() => {
    const list: UsedCoupon[] = [];
    filterUserCoupon(usedCouponModels).forEach(userCoupon => {
      const coupon = sdk.storeManager.getById(STORE_NAME.COUPON, userCoupon.couponId);
      if (!coupon) {
        return;
      }
      list.push({
        ...coupon,
        ...userCoupon,
        ...getNormalCouponInfo(coupon),
        type: 'used' as const,
        originalType: coupon.type,
      });
    });
    return list;
  }, [usedCouponModels, filterUserCoupon]);

  const expiredCoupons = useMemo(() => {
    const list: ExpiredCoupon[] = [];
    filterUserCoupon(expiredCouponModels).forEach(userCoupon => {
      const coupon = sdk.storeManager.getById(STORE_NAME.COUPON, userCoupon.couponId);
      if (!coupon) {
        return;
      }
      list.push({
        ...coupon,
        ...userCoupon,
        ...getNormalCouponInfo(coupon),
        type: 'expired' as const,
        originalType: coupon.type,
      });
    });
    return list;
  }, [expiredCouponModels, filterUserCoupon]);

  const allCoupons = useMemo(() => {
    const list: AllCoupon[] = [];
    filterUserCoupon(allCouponModels).forEach(userCoupon => {
      const coupon = sdk.storeManager.getById(STORE_NAME.COUPON, userCoupon.couponId);
      if (!coupon) {
        return;
      }
      const status = userCoupon.status;
      const type =
        status === COUPON_STATUS.ACTIVE
          ? coupon.isExpired
            ? ('expired' as const)
            : ('active' as const)
          : ('used' as const);
      list.push({
        ...coupon,
        ...userCoupon,
        ...getNormalCouponInfo(coupon),
        type,
        originalType: coupon.type,
      });
    });
    return list;
  }, [allCouponModels, filterUserCoupon]);

  const couponDict = useMemo(() => {
    const dict = new Map<string, (typeof allCoupons)[number]>();
    allCoupons.forEach(item => {
      dict.set(item.id, item);
    });
    return dict;
  }, [allCoupons]);

  return {
    activeCouponIds,
    usedCouponIds,
    expiredCouponIds,
    allCouponIds,
    activeCoupons,
    usedCoupons,
    expiredCoupons,
    allCoupons,
    couponDict,
  };
}
