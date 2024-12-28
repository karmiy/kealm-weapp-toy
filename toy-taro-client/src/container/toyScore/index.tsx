import { Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import styles from './index.module.scss';

interface ToyScoreProps {
  className?: string;
  current: number;
  original?: number;
  colorMode?: 'plain' | 'inverse';
}

const ToyScore = (props: ToyScoreProps) => {
  const { className, current, original, colorMode = 'plain' } = props;

  return (
    <View
      className={clsx(styles.wrapper, { [styles.isInverse]: colorMode === 'inverse' }, className)}
    >
      <Text className={styles.current}>{current}积分</Text>
      <Text className={styles.origin}>{original}积分</Text>
    </View>
  );
};

export { ToyScore };
