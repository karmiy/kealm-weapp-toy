import { useCallback, useState } from 'react';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { ORDER_STATUS, sdk } from '@core';
import { ORDER_ACTION_ID } from './constants';

export function useOrderAction() {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentActionId, setCurrentActionId] = useState<ORDER_ACTION_ID>();

  const handleRevoke = useCallback(async (id: string) => {
    try {
      const feedback = await showModal({
        content: '您确定要撤销兑换这件商品吗？撤销后请与管理员联系处理归还事宜',
      });
      if (!feedback) {
        return;
      }
      setIsActionLoading(true);
      setCurrentActionId(ORDER_ACTION_ID.REVOKE);
      await sdk.modules.order.updateOrderStatus(id, ORDER_STATUS.REVOKING);
      showToast({
        title: '撤销成功',
      });
    } catch (error) {
      showToast({
        title: error.message ?? '撤销失败',
      });
    } finally {
      setIsActionLoading(false);
      setCurrentActionId(undefined);
    }
  }, []);

  const handleApprove = useCallback(async (id: string) => {
    try {
      const feedback = await showModal({
        content: '确认同意撤销兑换吗？',
      });
      if (!feedback) {
        return;
      }
      setIsActionLoading(true);
      setCurrentActionId(ORDER_ACTION_ID.APPROVE);
      await sdk.modules.order.updateOrderStatus(id, ORDER_STATUS.APPROVED);
      showToast({
        title: '同意撤销成功',
      });
    } catch (error) {
      showToast({
        title: error.message ?? '同意撤销失败',
      });
    } finally {
      setIsActionLoading(false);
      setCurrentActionId(undefined);
    }
  }, []);

  const handleReject = useCallback(async (id: string) => {
    try {
      const feedback = await showModal({
        content: '确认拒绝撤销兑换吗？',
      });
      if (!feedback) {
        return;
      }
      setIsActionLoading(true);
      setCurrentActionId(ORDER_ACTION_ID.REJECT);
      await sdk.modules.order.updateOrderStatus(id, ORDER_STATUS.REJECTED);
      showToast({
        title: '拒绝撤销成功',
      });
    } catch (error) {
      showToast({
        title: error.message ?? '拒绝撤销失败',
      });
    } finally {
      setIsActionLoading(false);
      setCurrentActionId(undefined);
    }
  }, []);

  return {
    isActionLoading,
    currentActionId,
    handleRevoke,
    handleApprove,
    handleReject,
  };
}

export { ORDER_ACTION_ID };
