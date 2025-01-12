import { Text, View } from '@tarojs/components';
import { Button, Rate } from '@ui/components';
import styles from './index.module.scss';

interface TaskItemProps {
  title: string;
  desc: string;
  score: number;
  difficulty: number;
  isPending: boolean;
}

const TaskItem = (props: TaskItemProps) => {
  const { title, desc, score, difficulty, isPending } = props;

  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <View className={styles.titleWrapper}>
          <Text className={styles.title}>{title}</Text>
          <Text className={styles.desc}>{desc}</Text>
        </View>
        <Text className={styles.scoreWrapper}>+{score}积分</Text>
      </View>
      <View className={styles.footer}>
        <View className={styles.difficulty}>
          难度：
          <Rate value={difficulty} max={difficulty} size={12} />
        </View>
        <Button disabled={isPending}>{!isPending ? '完成' : '审批中'}</Button>
      </View>
    </View>
  );
};

export { TaskItem };
