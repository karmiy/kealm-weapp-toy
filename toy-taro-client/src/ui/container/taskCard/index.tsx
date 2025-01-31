import { useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import { TASK_STATUS, TASK_TYPE, TASK_TYPE_LABEL } from '@core';
import { Rate } from '@ui/components';
import { OPERATE_TIME_TITLE } from './constants';
import styles from './index.module.scss';

interface TaskCardProps {
  className?: string;
  type?: 'primary' | 'plain';
  name: string;
  desc: string;
  rewardTitle: string;
  difficulty: number;
  taskType?: TASK_TYPE;
  categoryName?: string;
  status?: TASK_STATUS;
  operateTime?: string;
  action?: React.ReactNode;
}

const TaskCard = (props: TaskCardProps) => {
  const {
    className,
    name,
    desc,
    rewardTitle,
    difficulty,
    taskType,
    categoryName,
    status,
    operateTime,
    action,
    type = 'primary',
  } = props;

  const Content = useMemo(() => {
    if (!taskType || !categoryName || !operateTime) {
      return null;
    }

    const operateTimeTitle = status ? OPERATE_TIME_TITLE[status] : '';

    return (
      <View className={styles.content}>
        {taskType && categoryName ? (
          <View className={styles.item}>
            <Text>任务类型：</Text>
            <Text>{`${TASK_TYPE_LABEL[taskType]} - ${categoryName}`}</Text>
          </View>
        ) : null}
        {operateTime && operateTimeTitle ? (
          <View className={styles.item}>
            <Text>{operateTimeTitle}：</Text>
            <Text>{operateTime}</Text>
          </View>
        ) : null}
      </View>
    );
  }, [categoryName, operateTime, status, taskType]);

  return (
    <View
      className={clsx(styles.taskCardWrapper, { [styles.isPlain]: type === 'plain' }, className)}
    >
      <View className={styles.header}>
        <View className={styles.titleWrapper}>
          <Text className={styles.title}>{name}</Text>
          <Text className={styles.desc}>{desc}</Text>
        </View>
        <Text className={styles.scoreWrapper}>{rewardTitle}</Text>
      </View>
      {Content}
      <View className={styles.footer}>
        <View className={styles.difficulty}>
          难度：
          <Rate value={difficulty} max={difficulty} size={12} />
        </View>
        <View>{action}</View>
      </View>
    </View>
  );
};

export { TaskCard };
