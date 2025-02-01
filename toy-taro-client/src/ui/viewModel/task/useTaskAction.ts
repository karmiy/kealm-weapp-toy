import { useCallback, useState } from 'react';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { sdk, TASK_REWARD_TYPE, TASK_STATUS, TaskUpdateParams } from '@core';
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

  const handleUpdate = useCallback(
    async (
      params: Partial<Omit<TaskUpdateParams, 'value'>> & {
        value?: string;
        onSuccess?: () => void;
      },
    ) => {
      try {
        const {
          id,
          name,
          desc,
          type,
          categoryId,
          difficulty,
          rewardType,
          value,
          couponId,
          onSuccess,
        } = params;
        if (!name) {
          showToast({
            title: '请输入任务名称',
          });
          return;
        }
        if (!desc) {
          showToast({
            title: '请输入任务描述',
          });
          return;
        }
        if (!type) {
          showToast({
            title: '请选择任务类型',
          });
          return;
        }
        if (!categoryId) {
          showToast({
            title: '请选择任务分类',
          });
          return;
        }
        if (!difficulty) {
          showToast({
            title: '请选择任务难度',
          });
          return;
        }
        if (!rewardType) {
          showToast({
            title: '请选择奖励类型',
          });
          return;
        }
        if (rewardType === TASK_REWARD_TYPE.POINTS && !value) {
          showToast({
            title: '请输入奖励积分',
          });
          return;
        }
        if (rewardType !== TASK_REWARD_TYPE.POINTS && !couponId) {
          showToast({
            title: '请选择奖励优惠券',
          });
          return;
        }
        setIsActionLoading(true);
        setCurrentActionId(TASK_ACTION_ID.UPDATE_TASK);
        await sdk.modules.task.updateTask({
          id,
          name,
          desc,
          type,
          categoryId,
          difficulty,
          rewardType,
          value: Number(value),
          couponId,
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
            title: '请输入任务分类名称',
          });
          return;
        }
        setIsActionLoading(true);
        setCurrentActionId(TASK_ACTION_ID.UPDATE_TASK_CATEGORY);
        await sdk.modules.task.updateTaskCategory({
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

  return {
    submitApprovalRequest,
    handleApprove,
    handleReject,
    handleUpdate,
    handleUpdateCategory,
    isActionLoading,
    currentActionId,
  };
}

export { TASK_ACTION_ID };
