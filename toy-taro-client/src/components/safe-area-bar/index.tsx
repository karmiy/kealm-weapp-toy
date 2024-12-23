import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { STATUS_BAR_HEIGHT } from '@/utils/utils';
import styles from './index.module.scss';

interface SafeAreaBarProps {
  isWhiteBg?: boolean;
}

const SafeAreaBar = (props: SafeAreaBarProps) => {
  const { isWhiteBg = false } = props;
  return (
    <View
      className={clsx({
        [styles.whiteBg]: isWhiteBg,
      })}
      style={{ height: STATUS_BAR_HEIGHT }}
    />
  );
};

export { SafeAreaBar };
