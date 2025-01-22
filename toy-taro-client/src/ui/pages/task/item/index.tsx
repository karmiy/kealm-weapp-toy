import { useCallback, useContext } from 'react';
import { Text, View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { Button, Rate } from '@ui/components';
import { useStoreById, useTaskAction } from '@ui/viewModel';
import { TaskContext } from '../context';
import styles from './index.module.scss';

interface TaskItemProps {
  id: string;
}

const TaskItem = (props: TaskItemProps) => {
  const { id } = props;
  const task = useStoreById(STORE_NAME.TASK, id);
  const { submitApprovalRequest, isSubmitApproving } = useTaskAction();
  const { onSubmitApproval } = useContext(TaskContext);

  const handleSubmitApproval = useCallback(() => {
    submitApprovalRequest(id, {
      success: () => onSubmitApproval(true),
      fallback: () => onSubmitApproval(false),
    });
  }, [id, onSubmitApproval, submitApprovalRequest]);

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
