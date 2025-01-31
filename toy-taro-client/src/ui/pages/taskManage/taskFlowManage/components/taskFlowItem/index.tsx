import { Fragment, useCallback, useMemo } from 'react';
import { View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { Button, WhiteSpace } from '@ui/components';
import { TaskCard } from '@ui/container';
import { TASK_ACTION_ID, useStoreById, useTaskAction, useUserInfo } from '@ui/viewModel';
import { ACTION_TITLE } from './constants';
import styles from './index.module.scss';

interface TaskFlowItemProps {
  id: string;
}

const TaskFlowItem = (props: TaskFlowItemProps) => {
  const { id } = props;
  const { isAdmin } = useUserInfo();
  const taskFlow = useStoreById(STORE_NAME.TASK_FLOW, id);
  const status = taskFlow?.status;
  const { isActionLoading, handleApprove, handleReject, currentActionId } = useTaskAction();
  const { taskId } = taskFlow ?? {};
  const task = useStoreById(STORE_NAME.TASK, taskId);

  const taskCategory = useStoreById(STORE_NAME.TASK_CATEGORY, task?.categoryId);

  const handleAction = useCallback(
    async (actionId?: TASK_ACTION_ID) => {
      if (!actionId) {
        return;
      }
      actionId === TASK_ACTION_ID.APPROVE && handleApprove(id);
      actionId === TASK_ACTION_ID.REJECT && handleReject(id);
    },
    [handleApprove, handleReject, id],
  );

  const Action = useMemo(() => {
    if (!status) {
      return null;
    }
    const role = isAdmin ? 'admin' : 'user';
    return (
      <View className={styles.actionWrapper}>
        {ACTION_TITLE[role][status].map((item, index) => {
          return (
            <Fragment key={index}>
              {index !== 0 && <WhiteSpace isVertical={false} size='small' />}
              <Button
                type={item.type}
                disabled={isActionLoading || item.disabled}
                icon={
                  isActionLoading && currentActionId && currentActionId === item.id
                    ? 'loading'
                    : undefined
                }
                onClick={() => handleAction(item.id)}
              >
                {item.label}
              </Button>
            </Fragment>
          );
        })}
      </View>
    );
  }, [currentActionId, handleAction, isActionLoading, isAdmin, status]);

  if (!task || !taskFlow) {
    return null;
  }

  const { name, desc, difficulty } = task! ?? {};

  return (
    <TaskCard
      className={styles.taskFlowItemWrapper}
      type='plain'
      name={name}
      desc={desc}
      rewardTitle={task.rewardTitle}
      difficulty={difficulty}
      taskType={task.type}
      categoryName={taskCategory?.name}
      operateTime={taskFlow.lastModifiedDate}
      status={taskFlow.status}
      action={Action}
    />
  );
};

export { TaskFlowItem };
