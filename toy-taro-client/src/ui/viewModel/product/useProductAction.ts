import { useCallback, useState } from 'react';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { ProductUpdateParams, sdk } from '@core';
import { PRODUCT_ACTION_ID } from './constants';

export function useProductAction() {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentActionId, setCurrentActionId] = useState<PRODUCT_ACTION_ID>();

  const handleUpdate = useCallback(
    async (
      params: Partial<Omit<ProductUpdateParams, 'originalScore' | 'discountedScore'>> & {
        originalScore?: string;
        discountedScore?: string;
        onSuccess?: () => void;
      },
    ) => {
      try {
        const {
          id,
          name,
          desc,
          discountedScore,
          originalScore,
          stock,
          coverImage,
          categoryId,
          flashSaleStart,
          flashSaleEnd,
          onSuccess,
        } = params;
        if (!coverImage) {
          showToast({
            title: '请选择产品封面',
          });
          return;
        }
        if (!name) {
          showToast({
            title: '请输入产品名称',
          });
          return;
        }
        if (!desc) {
          showToast({
            title: '请输入产品描述',
          });
          return;
        }
        if (!categoryId) {
          showToast({
            title: '请选择产品分类',
          });
          return;
        }
        if (!stock) {
          showToast({
            title: '库存数量不能为空',
          });
          return;
        }
        if (!originalScore || Number(originalScore) === 0) {
          showToast({
            title: '兑换积分不能为空或0',
          });
          return;
        }
        if (discountedScore && Number(discountedScore) === 0) {
          showToast({
            title: '特惠积分不能为0',
          });
          return;
        }
        if (discountedScore && Number(discountedScore) >= Number(originalScore)) {
          showToast({
            title: '特惠积分应小于兑换积分',
          });
          return;
        }
        if (discountedScore && (!flashSaleStart || !flashSaleEnd)) {
          showToast({
            title: '请选择特惠时间',
          });
          return;
        }
        setIsActionLoading(true);
        setCurrentActionId(PRODUCT_ACTION_ID.UPDATE_PRODUCT);
        await sdk.modules.product.updateProduct({
          id,
          name,
          desc,
          discountedScore: discountedScore ? Number(discountedScore) : undefined,
          originalScore: Number(originalScore),
          stock,
          coverImage,
          categoryId,
          flashSaleStart,
          flashSaleEnd,
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
        setCurrentActionId(undefined);
      }
    },
    [],
  );

  const handleUpdateCategory = useCallback(
    async (params: { id?: string; name?: string; onSuccess?: () => void }) => {
      try {
        const { id, name, onSuccess } = params;
        if (!name) {
          showToast({
            title: '请输入商品分类名称',
          });
          return;
        }
        setIsActionLoading(true);
        setCurrentActionId(PRODUCT_ACTION_ID.UPDATE_PRODUCT_CATEGORY);
        await sdk.modules.product.updateProductCategory({
          id,
          name,
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
        setCurrentActionId(undefined);
      }
    },
    [],
  );

  const handleDelete = useCallback(
    async (params: { id: string; onSuccess?: () => void }) => {
      const { id, onSuccess } = params;
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
        setCurrentActionId(PRODUCT_ACTION_ID.DELETE_PRODUCT);
        await sdk.modules.product.deleteProduct(id);
        showToast({
          title: '删除成功',
        });
        onSuccess?.();
      } catch (e) {
        showToast({
          title: e.message ?? '删除失败',
        });
      } finally {
        setIsActionLoading(false);
        setCurrentActionId(undefined);
      }
    },
    [isActionLoading],
  );

  const handleDeleteCategory = useCallback(
    async (params: { id: string; onSuccess?: () => void }) => {
      const { id, onSuccess } = params;
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
        setCurrentActionId(PRODUCT_ACTION_ID.DELETE_PRODUCT_CATEGORY);
        await sdk.modules.product.deleteProductCategory(id);
        showToast({
          title: '删除成功',
        });
        onSuccess?.();
      } catch (e) {
        showToast({
          title: e.message ?? '删除失败',
        });
      } finally {
        setIsActionLoading(false);
        setCurrentActionId(undefined);
      }
    },
    [isActionLoading],
  );

  return {
    handleUpdate,
    handleUpdateCategory,
    handleDelete,
    handleDeleteCategory,
    isActionLoading,
    currentActionId,
  };
}

export { PRODUCT_ACTION_ID };
