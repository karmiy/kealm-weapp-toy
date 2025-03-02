import { showModal, showToast } from '@shared/utils/operateFeedback';
import { COUPON_VALIDITY_TIME_TYPE, CouponUpdateParams, sdk } from '@core';
import { useAction } from '../base';

export function useCouponAction() {
  const [handleUpdate, isUpdateLoading] = useAction(
    async (
      params: Partial<Omit<CouponUpdateParams, 'value' | 'minimumOrderValue'>> & {
        value?: string;
        minimumOrderValue?: string;
      },
    ) => {
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
      } = params;
      if (!name) {
        showToast({
          title: '请输入优惠券名称',
        });
        return false;
      }
      if (!type) {
        showToast({
          title: '请选择优惠券类型',
        });
        return false;
      }
      if (!value) {
        showToast({
          title: '请输入满减/打折金额',
        });
        return false;
      }
      if (!minimumOrderValue) {
        showToast({
          title: '请输入最低使用门槛',
        });
        return false;
      }
      if (!validityTimeType) {
        showToast({
          title: '请选择有效期',
        });
        return false;
      }
      if (validityTimeType === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE && (!startTime || !endTime)) {
        showToast({
          title: '请选择有效起止时间',
        });
        return false;
      }
      if (validityTimeType === COUPON_VALIDITY_TIME_TYPE.DATE_LIST && !dates?.length) {
        showToast({
          title: '请选择至少一个有效日期',
        });
        return false;
      }
      if (validityTimeType === COUPON_VALIDITY_TIME_TYPE.WEEKLY && !days?.length) {
        showToast({
          title: '请选择至少一个有效星期',
        });
        return false;
      }
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
    },
    {
      onSuccess: async () => {
        await showToast({
          title: '保存成功',
        });
      },
      onError: async error => {
        await showToast({
          title: error.message ?? '保存失败',
        });
      },
    },
  );

  const [handleDelete, isDeleteLoading] = useAction(
    async (params: { id: string }) => {
      const { id } = params;
      const feedback = await showModal({
        content: '确定要删除吗？',
      });
      if (!feedback) {
        return false;
      }
      await sdk.modules.coupon.deleteCoupon(id);
    },
    {
      onSuccess: async () => {
        await showToast({
          title: '删除成功',
        });
      },
      onError: async error => {
        await showToast({
          title: error.message ?? '删除失败',
        });
      },
    },
  );

  return {
    handleDelete,
    handleUpdate,
    isUpdateLoading,
    isDeleteLoading,
  };
}
