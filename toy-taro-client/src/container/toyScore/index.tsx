import { Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import styles from './index.module.scss';

interface ToyScoreProps {
  className?: string;
  discounted?: number;
  original: number;
  colorMode?: 'plain' | 'inverse';
}

const ToyScore = (props: ToyScoreProps) => {
  const { className, discounted, original, colorMode = 'plain' } = props;

  return (
    <View
      className={clsx(styles.wrapper, { [styles.isInverse]: colorMode === 'inverse' }, className)}
    >
      <Text className={styles.current}>{discounted ?? original}积分</Text>
      {discounted ? <Text className={styles.origin}>{original}积分</Text> : null}
    </View>
  );
};

export { ToyScore };
