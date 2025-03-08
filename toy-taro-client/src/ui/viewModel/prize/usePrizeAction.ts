import { showModal, showToast } from '@shared/utils/operateFeedback';
import { PRIZE_TYPE, PrizeUpdateParams, sdk } from '@core';
import { BLOCK_ACTION_MARK, useAction } from '../base';

export function usePrizeAction() {
  const [handleUpdatePrize, isUpdateLoading] = useAction(
    async (params: Partial<PrizeUpdateParams>) => {
      const { id, type, points, couponId, drawCount, text } = params;
      if (!type) {
        showToast({
          title: '请输入奖品类型',
        });
        return BLOCK_ACTION_MARK;
      }
      if (type === PRIZE_TYPE.POINTS && !points) {
        showToast({
          title: '请输入奖品积分',
        });
        return BLOCK_ACTION_MARK;
      }
      if (type === PRIZE_TYPE.COUPON && !couponId) {
        showToast({
          title: '请选择优惠券',
        });
        return BLOCK_ACTION_MARK;
      }
      if (type === PRIZE_TYPE.LUCKY_DRAW && !drawCount) {
        showToast({
          title: '请输入祈愿券数量',
        });
        return BLOCK_ACTION_MARK;
      }
      if (type === PRIZE_TYPE.NONE && !text) {
        showToast({
          title: '请输入无奖品时的提示信息',
        });
        return BLOCK_ACTION_MARK;
      }
      await sdk.modules.prize.updatePrize({
        id,
        type,
        points,
        couponId,
        drawCount,
        text,
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

  const [handleDeletePrize, isDeleteLoading] = useAction(
    async (params: { id: string }) => {
      const { id } = params;
      const feedback = await showModal({
        content: '确定要删除吗？',
      });
      if (!feedback) {
        return BLOCK_ACTION_MARK;
      }
      await sdk.modules.prize.deletePrize(id);
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

  const [handleSortPrize, isSortLoading] = useAction(
    async (params: { ids: string[] }) => {
      const { ids } = params;
      if (ids.length < 2) {
        return BLOCK_ACTION_MARK;
      }
      await sdk.modules.prize.sortPrize(ids);
    },
    {
      onError: async error => {
        await showToast({
          title: error.message ?? '排序失败',
        });
      },
    },
  );

  return {
    handleUpdatePrize,
    isUpdateLoading,
    handleDeletePrize,
    isDeleteLoading,
    handleSortPrize,
    isSortLoading,
  };
}
