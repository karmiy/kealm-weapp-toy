import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import { Rate } from '@ui/components';
import styles from './index.module.scss';

interface TaskCardProps {
  type?: 'primary' | 'plain';
  name: string;
  desc: string;
  rewardTitle: string;
  difficulty: number;
  action?: React.ReactNode;
}

const TaskCard = (props: TaskCardProps) => {
  const { name, desc, rewardTitle, difficulty, action, type = 'primary' } = props;

  return (
    <View className={clsx(styles.taskCardWrapper, { [styles.isPlain]: type === 'plain' })}>
      <View className={styles.header}>
        <View className={styles.titleWrapper}>
          <Text className={styles.title}>{name}</Text>
          <Text className={styles.desc}>{desc}</Text>
        </View>
        <Text className={styles.scoreWrapper}>{rewardTitle}</Text>
      </View>
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
