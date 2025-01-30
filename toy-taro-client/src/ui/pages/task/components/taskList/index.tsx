import { Fragment } from 'react';
import { View } from '@tarojs/components';
import { TASK_TYPE } from '@core';
import { StatusWrapper } from '@ui/components';
import { useTaskGroup } from '@ui/viewModel';
import { TaskItem } from '../taskItem';
import styles from './index.module.scss';

interface TaskListProps {
  type: TASK_TYPE;
  categoryId: string;
}

const TaskList = (props: TaskListProps) => {
  const { type, categoryId } = props;
  const { taskIds } = useTaskGroup({ type, categoryId });

  return (
    <View className={styles.taskListWrapper}>
      <StatusWrapper count={taskIds.length}>
        {taskIds.map(id => {
          return (
            <Fragment key={id}>
              <TaskItem id={id} />
            </Fragment>
          );
        })}
      </StatusWrapper>
    </View>
  );
};

export { TaskList };
