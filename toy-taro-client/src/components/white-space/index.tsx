import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import styles from './index.module.scss';

interface Props {
  size?: 'medium' | 'large';
  isVertical?: boolean;
}

const WhiteSpace = (props: Props) => {
  const { size, isVertical = true } = props;

  return (
    <View
      className={clsx({
        [styles.vWhiteSpace]: isVertical,
        [styles.hWhiteSpace]: !isVertical,
        [styles.isMedium]: size === 'medium',
        [styles.isLarge]: size === 'large',
      })}
    />
  );
};

export { WhiteSpace };
