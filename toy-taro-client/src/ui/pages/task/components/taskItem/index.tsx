import { useCallback } from 'react';
import { PAGE_ID } from '@shared/utils/constants';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import { Button } from '@ui/components';
import { TaskCard } from '@ui/container';
import {
  useStoreById,
  useTaskAction,
  useTaskFlowGroup,
  useTaskItem,
  useUserInfo,
} from '@ui/viewModel';
// import styles from './index.module.scss';

interface TaskItemProps {
  id: string;
}

const TaskItem = (props: TaskItemProps) => {
  const { id } = props;
  const task = useTaskItem({ id });
  const creator = useStoreById(STORE_NAME.CONTACT, task?.userId);
  const { taskFlow } = useTaskFlowGroup({ taskId: id });
  const { isAdmin } = useUserInfo();
  const { submitApprovalRequest, isActionLoading } = useTaskAction();

  const handleSubmitApproval = useCallback(() => {
    submitApprovalRequest(id, taskFlow?.id);
  }, [submitApprovalRequest, id, taskFlow?.id]);

  const handleEdit = useCallback(() => {
    if (taskFlow?.isFinished) {
      showToast({
        title: '无法编辑，用户已完成任务',
      });
      return;
    }
    if (taskFlow?.isPendingApproval) {
      showToast({
        title: '无法编辑，任务正在审批中',
      });
      return;
    }
    navigateToPage({ pageName: PAGE_ID.TASK_MANAGE, params: { id } });
  }, [id, taskFlow?.isFinished, taskFlow?.isPendingApproval]);

  if (!task) {
    return null;
  }

  const difficulty = task.difficulty;
  const isPendingApprove = taskFlow?.isPendingApproval ?? false;
  const isFinished = taskFlow?.isFinished ?? false;

  return (
    <TaskCard
      name={task.name}
      desc={task.desc}
      contentSpace='small'
      rewardTitle={task.rewardTitle}
      difficulty={difficulty}
      creatorType='creator'
      creatorName={creator?.name}
      action={
        isAdmin ? (
          <Button type='plain' disabled={isActionLoading} icon='edit' onClick={handleEdit}>
            编辑
          </Button>
        ) : (
          <Button
            disabled={isPendingApprove || isFinished || isActionLoading}
            onClick={handleSubmitApproval}
          >
            {!isPendingApprove ? (isFinished ? '已完成' : '完成') : '审批中'}
          </Button>
        )
      }
    />
  );
};

export { TaskItem };
