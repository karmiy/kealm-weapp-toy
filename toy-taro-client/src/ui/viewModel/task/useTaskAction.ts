import { useCallback, useState } from 'react';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { sdk, TASK_STATUS, TaskUpdateParams } from '@core';
import { TASK_ACTION_ID } from './constants';

export function useTaskAction() {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentActionId, setCurrentActionId] = useState<TASK_ACTION_ID>();

  const submitApprovalRequest = useCallback(
    async (id: string, taskFlow?: string) => {
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
        await sdk.modules.task.submitApprovalRequest(id, taskFlow);
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
    async (id: string, taskId: string) => {
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
        await sdk.modules.task.updateTaskFlowStatus(id, taskId, TASK_STATUS.APPROVED);
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
    async (id: string, taskId: string) => {
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
        await sdk.modules.task.updateTaskFlowStatus(id, taskId, TASK_STATUS.REJECTED);
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
        onSuccess?: () => void;
      },
    ) => {
      try {
        const { id, name, desc, type, categoryId, difficulty, prizeId, onSuccess } = params;
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
        if (!prizeId) {
          showToast({
            title: '请选择任务奖品',
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
          prizeId,
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
        setCurrentActionId(TASK_ACTION_ID.DELETE_TASK);
        await sdk.modules.task.deleteTask(id);
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
        setCurrentActionId(TASK_ACTION_ID.DELETE_TASK_CATEGORY);
        await sdk.modules.task.deleteTaskCategory(id);
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
    submitApprovalRequest,
    handleApprove,
    handleReject,
    handleUpdate,
    handleUpdateCategory,
    handleDelete,
    handleDeleteCategory,
    isActionLoading,
    currentActionId,
  };
}

export { TASK_ACTION_ID };
