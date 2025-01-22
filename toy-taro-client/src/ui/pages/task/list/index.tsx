import { Fragment } from 'react';
import { View } from '@tarojs/components';
import { TASK_TYPE } from '@core';
import { StatusWrapper, WhiteSpace } from '@ui/components';
import { useTaskCategory } from '@ui/viewModel';
import { TaskItem } from '../item';
import styles from './index.module.scss';

interface TaskListProps {
  type: TASK_TYPE;
  categoryId: string;
}

const TaskList = (props: TaskListProps) => {
  const { type, categoryId } = props;
  const { taskIds } = useTaskCategory({ type, categoryId });

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
