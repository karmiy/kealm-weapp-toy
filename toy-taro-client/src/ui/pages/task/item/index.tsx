import { useCallback } from 'react';
import { Text, View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { Button, Rate } from '@ui/components';
import { useOperateFeedback } from '@ui/hoc';
import { useStoreById, useTaskAction } from '@ui/viewModel';
import styles from './index.module.scss';

interface TaskItemProps {
  id: string;
}

const SUBMIT_APPROVE_MES = {
  SUCCESS: '已发起申请，请等待管理员确认~',
  FAIL: '发起申请失败，请联系管理员！',
};

const TaskItem = (props: TaskItemProps) => {
  const { id } = props;
  const task = useStoreById(STORE_NAME.TASK, id);
  const { submitApprovalRequest, isSubmitApproving } = useTaskAction();
  const { openToast } = useOperateFeedback();

  const handleSubmitApproval = useCallback(() => {
    submitApprovalRequest(id, {
      success: () => openToast({ text: SUBMIT_APPROVE_MES.SUCCESS }),
      fallback: () => openToast({ text: SUBMIT_APPROVE_MES.FAIL }),
    });
  }, [submitApprovalRequest, id, openToast]);

  if (!task || task.isApproved) {
    return null;
  }

  const difficulty = task.difficulty;
  const isPendingApprove = task.isPendingApprove;

  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <View className={styles.titleWrapper}>
          <Text className={styles.title}>{task.name}</Text>
          <Text className={styles.desc}>{task.desc}</Text>
        </View>
        <Text className={styles.scoreWrapper}>{task.rewardTitle}</Text>
      </View>
      <View className={styles.footer}>
        <View className={styles.difficulty}>
          难度：
          <Rate value={difficulty} max={difficulty} size={12} />
        </View>
        <Button disabled={isPendingApprove || isSubmitApproving} onClick={handleSubmitApproval}>
          {!isPendingApprove ? '完成' : '审批中'}
        </Button>
      </View>
    </View>
  );
};

export { TaskItem };
