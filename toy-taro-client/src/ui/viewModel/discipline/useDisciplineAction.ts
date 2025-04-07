import { showToast } from '@shared/utils/operateFeedback';
import { DISCIPLINE_TYPE, sdk } from '@core';
import { BLOCK_ACTION_MARK, useAction } from '../base';

export function useDisciplineAction() {
  const [handleCreate, isCreateLoading] = useAction(
    async (params: {
      userId?: string;
      prizeId?: string;
      type?: DISCIPLINE_TYPE;
      reason?: string;
    }) => {
      const { userId, prizeId, type, reason } = params;

      if (!userId) {
        showToast({
          title: '请选择用户',
        });
        return BLOCK_ACTION_MARK;
      }

      if (!type) {
        showToast({
          title: '请选择奖惩类型',
        });
        return BLOCK_ACTION_MARK;
      }

      if (!prizeId) {
        showToast({
          title: '请选择奖惩内容',
        });
        return BLOCK_ACTION_MARK;
      }

      if (!reason) {
        showToast({
          title: '请输入原因',
        });
        return BLOCK_ACTION_MARK;
      }

      return await sdk.modules.discipline.createDiscipline({
        userId,
        prizeId,
        type,
        reason,
      });
    },
    {
      onSuccess: async () => {
        await showToast({
          title: '操作成功',
        });
      },
      onError: async error => {
        await showToast({
          title: error.message ?? '操作失败',
        });
      },
    },
  );

  return {
    handleCreate,
    isCreateLoading,
  };
}
