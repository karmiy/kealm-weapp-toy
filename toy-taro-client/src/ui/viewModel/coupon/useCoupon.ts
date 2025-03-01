import { useCallback, useEffect, useMemo, useState } from 'react';
import { reaction } from '@shared/utils/observer';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import {
  COUPON_STATUS,
  COUPON_VALIDITY_TIME_TYPE,
  CouponModel,
  CouponUpdateParams,
  sdk,
  STORE_NAME,
} from '@core';
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
  const [isActionLoading, setIsActionLoading] = useState(false);
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

  const getNormalCouponInfo = useCallback((coupon: CouponModel) => {
    return {
      discountTip: coupon.discountTip,
      usageScopeTip: coupon.usageScopeTip,
      conditionTip: coupon.conditionTip,
      expirationTip: coupon.expirationTip,
      detailTip: coupon.detailTip,
      shortTip: coupon.shortTip,
    };
  }, []);

  const activeCoupons = useMemo(() => {
    return activeCouponModels.map(coupon => {
      const discountInfo =
        typeof orderScore !== 'undefined'
          ? coupon.getDiscountInfo(orderScore)
          : { score: 0, enabled: true };
      return {
        ...coupon,
        ...getNormalCouponInfo(coupon),
        type: discountInfo.enabled ? ('selectable' as const) : ('unselectable' as const),
        originalType: coupon.type,
        selectable: discountInfo.enabled,
        discountScore: discountInfo.score,
      };
    });
  }, [activeCouponModels, orderScore, getNormalCouponInfo]);

  const usedCoupons = useMemo(() => {
    return usedCouponModels.map(coupon => {
      return {
        ...coupon,
        ...getNormalCouponInfo(coupon),
        type: 'used' as const,
        originalType: coupon.type,
      };
    });
  }, [usedCouponModels, getNormalCouponInfo]);

  const expiredCoupons = useMemo(() => {
    return expiredCouponModels.map(coupon => {
      return {
        ...coupon,
        ...getNormalCouponInfo(coupon),
        type: 'expired' as const,
        originalType: coupon.type,
      };
    });
  }, [expiredCouponModels, getNormalCouponInfo]);

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
        ...getNormalCouponInfo(coupon),
        type,
        originalType: coupon.type,
      };
    });
  }, [allCouponModels, getNormalCouponInfo]);

  const couponDict = useMemo(() => {
    const dict = new Map<string, (typeof allCoupons)[number]>();
    allCoupons.forEach(item => {
      dict.set(item.id, item);
    });
    return dict;
  }, [allCoupons]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        if (isActionLoading) {
          return;
        }
        const feedback = await showModal({
          content: '确定要删除吗？',
        });
        if (!feedback) {
          return;
        }
        setIsActionLoading(true);
        await sdk.modules.coupon.deleteCoupon(id);
        showToast({
          title: '删除成功',
        });
      } catch (e) {
        showToast({
          title: e.message ?? '删除失败',
        });
      } finally {
        setIsActionLoading(false);
      }
    },
    [isActionLoading],
  );

  const handleUpdate = useCallback(
    async (
      params: Partial<Omit<CouponUpdateParams, 'value' | 'minimumOrderValue'>> & {
        value?: string;
        minimumOrderValue?: string;
        onSuccess?: () => void;
      },
    ) => {
      try {
        const {
          id,
          name,
          type,
          value,
          minimumOrderValue,
          validityTimeType,
          startTime,
          endTime,
          dates,
          days,
          onSuccess,
        } = params;
        if (!name) {
          showToast({
            title: '请输入优惠券名称',
          });
          return;
        }
        if (!type) {
          showToast({
            title: '请选择优惠券类型',
          });
          return;
        }
        if (!value) {
          showToast({
            title: '请输入满减/打折金额',
          });
          return;
        }
        if (!minimumOrderValue) {
          showToast({
            title: '请输入最低使用门槛',
          });
          return;
        }
        if (!validityTimeType) {
          showToast({
            title: '请选择有效期',
          });
          return;
        }
        if (validityTimeType === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE && (!startTime || !endTime)) {
          showToast({
            title: '请选择有效起止时间',
          });
          return;
        }
        if (validityTimeType === COUPON_VALIDITY_TIME_TYPE.DATE_LIST && !dates?.length) {
          showToast({
            title: '请选择至少一个有效日期',
          });
          return;
        }
        if (validityTimeType === COUPON_VALIDITY_TIME_TYPE.WEEKLY && !days?.length) {
          showToast({
            title: '请选择至少一个有效星期',
          });
          return;
        }
        setIsActionLoading(true);
        await sdk.modules.coupon.updateCoupon({
          id,
          name,
          type,
          value: Number(value),
          minimumOrderValue: Number(minimumOrderValue),
          validityTimeType,
          startTime,
          endTime,
          dates,
          days,
        });
        await showToast({
          title: '保存成功',
        });
        onSuccess?.();
      } catch (error) {
        showToast({
          title: error.message ?? '保存失败',
        });
      } finally {
        setIsActionLoading(false);
      }
    },
    [],
  );

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
    handleDelete,
    handleUpdate,
    isActionLoading,
  };
}
