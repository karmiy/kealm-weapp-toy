import { Fragment, useCallback, useMemo, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { sdk, STORE_NAME, TASK_TYPE_LIST } from '@core';
import { Button, WhiteSpace } from '@ui/components';
import { TaskCard } from '@ui/container';
import { useStoreById, useUserInfo } from '@ui/viewModel';
import { ACTION_ID, ACTION_TITLE } from './constants';
import styles from './index.module.scss';

interface TaskFlowItemProps {
  id: string;
}

const TaskFlowItem = (props: TaskFlowItemProps) => {
  const { id } = props;
  const { isAdmin } = useUserInfo();
  const taskFlow = useStoreById(STORE_NAME.TASK_FLOW, id);
  const status = taskFlow?.status;
  const [isActionLoading, setIsActionLoading] = useState(false);

  const { taskId } = taskFlow ?? {};
  const task = useStoreById(STORE_NAME.TASK, taskId);

  const taskCategory = useStoreById(STORE_NAME.TASK_CATEGORY, task?.categoryId);

  const handleApprove = useCallback(async () => {
    try {
      const feedback = await showModal({
        content: '确定要同意审批吗？',
      });
      if (!feedback) {
        return;
      }
      setIsActionLoading(true);
      await sdk.modules.task.approveTask(id);
      showToast({
        title: '审批成功',
      });
    } catch (error) {
      showToast({
        title: error.message ?? '操作失败',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [id]);

  const handleReject = useCallback(async () => {
    try {
      const feedback = await showModal({
        content: '确定要拒绝审批吗？',
      });
      if (!feedback) {
        return;
      }
      setIsActionLoading(true);
      await sdk.modules.task.rejectTask(id);
      showToast({
        title: '拒绝审批成功',
      });
    } catch (error) {
      showToast({
        title: error.message ?? '操作失败',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [id]);

  const handleAction = useCallback(
    async (actionId?: ACTION_ID) => {
      if (!actionId) {
        return;
      }
      actionId === ACTION_ID.APPROVE && handleApprove();
      actionId === ACTION_ID.REJECT && handleReject();
    },
    [handleApprove, handleReject],
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
                onClick={() => handleAction(item.id)}
              >
                {item.label}
              </Button>
            </Fragment>
          );
        })}
      </View>
    );
  }, [handleAction, isActionLoading, isAdmin, status]);

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
