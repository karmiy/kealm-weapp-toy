import { PAGE_ID } from '@shared/utils/constants';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { LUCK_DRAW_PREVIEW_ID, LuckyDrawUpdateParams, sdk } from '@core';
import { useAction } from '../base';

export function useLuckyDrawAction() {
  const [createPreview] = useAction(
    async (params: Partial<LuckyDrawUpdateParams>) => {
      const { coverImage, name, type, quantity, list } = params;
      if (!coverImage) {
        showToast({
          title: '请选择祈愿池封面',
        });
        return false;
      }
      if (!name) {
        showToast({
          title: '请输入祈愿池名称',
        });
        return false;
      }
      if (!type) {
        showToast({
          title: '请选择祈愿池类型',
        });
        return false;
      }
      if (!quantity) {
        showToast({
          title: '请输入祈愿券数量',
        });
        return false;
      }
      if (!list || !list.length) {
        showToast({
          title: '请选中祈愿池奖品',
        });
        return false;
      }
      if (list.some(item => !item.range)) {
        showToast({
          title: '奖品权重不能为 0',
        });
        return false;
      }
      await sdk.modules.luckyDraw.createMockLuckyDraw({
        coverImage,
        name,
        type,
        quantity,
        list,
      });
    },
    {
      onSuccess: () => {
        navigateToPage({
          pageName: PAGE_ID.LUCKY_DRAW_DETAIL,
          params: {
            id: LUCK_DRAW_PREVIEW_ID,
          },
        });
      },
      onError: async error => {
        await showToast({
          title: error.message ?? '预览异常',
        });
      },
    },
  );

  const [clearPreview] = useAction(
    async () => {
      await sdk.modules.luckyDraw.clearMockLuckyDraw();
    },
    {
      onError: async error => {
        await showToast({
          title: error.message ?? '预览异常',
        });
      },
    },
  );

  const [handleUpdate, isUpdateLoading] = useAction(
    async (params: Partial<LuckyDrawUpdateParams>) => {
      const { id, coverImage, name, type, quantity, list } = params;
      if (!coverImage) {
        showToast({
          title: '请选择祈愿池封面',
        });
        return false;
      }
      if (!name) {
        showToast({
          title: '请输入祈愿池名称',
        });
        return false;
      }
      if (!type) {
        showToast({
          title: '请选择祈愿池类型',
        });
        return false;
      }
      if (!quantity) {
        showToast({
          title: '请输入祈愿券数量',
        });
        return false;
      }
      if (!list || !list.length) {
        showToast({
          title: '请选中祈愿池奖品',
        });
        return false;
      }
      if (list.some(item => !item.range)) {
        showToast({
          title: '奖品权重不能为 0',
        });
        return false;
      }
      await sdk.modules.luckyDraw.updateLuckyDraw({
        id,
        coverImage,
        name,
        type,
        quantity,
        list,
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
      await sdk.modules.luckyDraw.deleteLuckyDraw(id);
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
    createPreview,
    clearPreview,
    handleUpdate,
    isUpdateLoading,
    handleDelete,
    isDeleteLoading,
  };
}
