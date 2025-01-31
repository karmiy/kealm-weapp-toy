import { useCallback, useState } from 'react';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { sdk, TASK_STATUS } from '@core';
import { TASK_ACTION_ID } from './constants';

export function useTaskAction() {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentActionId, setCurrentActionId] = useState<TASK_ACTION_ID>();

  const submitApprovalRequest = useCallback(
    async (id: string) => {
      try {
        if (isActionLoading) {
          return;
        }
        const feedback = await showModal({
          content: '请在提交前检查任务是否已完成~',
        });
        if (!feedback) {
          return;
        }
        setIsActionLoading(true);
        setCurrentActionId(TASK_ACTION_ID.APPROVAL_REQUEST);
        await sdk.modules.task.submitApprovalRequest(id);
        showToast({
          title: '已发起申请，请等待管理员确认~',
        });
      } catch (error) {
        showToast({
          title: error.message ?? '发起申请失败，请联系管理员！',
        });
      } finally {
        setIsActionLoading(false);
        setCurrentActionId(undefined);
      }
    },
    [isActionLoading],
  );

  const handleApprove = useCallback(
    async (id: string) => {
      try {
        if (isActionLoading) {
          return;
        }
        const feedback = await showModal({
          content: '确定要同意审批吗？',
        });
        if (!feedback) {
          return;
        }
        setIsActionLoading(true);
        setCurrentActionId(TASK_ACTION_ID.APPROVE);
        await sdk.modules.task.updateTaskFlowStatus(id, TASK_STATUS.APPROVED);
        showToast({
          title: '审批成功',
        });
      } catch (error) {
        showToast({
          title: error.message ?? '操作失败',
        });
      } finally {
        setIsActionLoading(false);
        setCurrentActionId(undefined);
      }
    },
    [isActionLoading],
  );

  const handleReject = useCallback(
    async (id: string) => {
      try {
        if (isActionLoading) {
          return;
        }
        const feedback = await showModal({
          content: '确定要拒绝审批吗？',
        });
        if (!feedback) {
          return;
        }
        setIsActionLoading(true);
        setCurrentActionId(TASK_ACTION_ID.REJECT);
        await sdk.modules.task.updateTaskFlowStatus(id, TASK_STATUS.REJECTED);
        showToast({
          title: '拒绝审批成功',
        });
      } catch (error) {
        showToast({
          title: error.message ?? '操作失败',
        });
      } finally {
        setIsActionLoading(false);
        setCurrentActionId(undefined);
      }
    },
    [isActionLoading],
  );

  return {
    submitApprovalRequest,
    handleApprove,
    handleReject,
    isActionLoading,
    currentActionId,
  };
}

export { TASK_ACTION_ID };
