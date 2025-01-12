import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import styles from './index.module.scss';

interface WhiteSpaceProps {
  size?: 'small' | 'medium' | 'large';
  isVertical?: boolean;
  line?: boolean;
}

const WhiteSpace = (props: WhiteSpaceProps) => {
  const { size = 'medium', isVertical = true, line = false } = props;

  return (
    <View
      className={clsx({
        [styles.vWhiteSpace]: isVertical,
        [styles.hWhiteSpace]: !isVertical,
        [styles.isMedium]: size === 'medium',
        [styles.isLarge]: size === 'large',
        [styles.line]: line,
      })}
    />
  );
};

export { WhiteSpace };
