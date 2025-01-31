import { useCallback } from 'react';
import { PAGE_ID } from '@shared/utils/constants';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import { Button } from '@ui/components';
import { TaskCard } from '@ui/container';
import { useStoreById, useTaskAction, useTaskFlowGroup, useUserInfo } from '@ui/viewModel';
// import styles from './index.module.scss';

interface TaskItemProps {
  id: string;
}

const TaskItem = (props: TaskItemProps) => {
  const { id } = props;
  const task = useStoreById(STORE_NAME.TASK, id);
  const { taskFlow } = useTaskFlowGroup({ taskId: id });
  const { isAdmin } = useUserInfo();
  const { submitApprovalRequest, isActionLoading } = useTaskAction();

  const handleSubmitApproval = useCallback(() => {
    submitApprovalRequest(id);
  }, [submitApprovalRequest, id]);

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
      rewardTitle={task.rewardTitle}
      difficulty={difficulty}
      action={
        isAdmin ? (
          <Button
            type='plain'
            disabled={isActionLoading}
            icon='edit'
            onClick={() => navigateToPage({ pageName: PAGE_ID.TASK_MANAGE, params: { id } })}
          >
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
