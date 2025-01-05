import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { STATUS_BAR_HEIGHT } from '@/utils/utils';
import styles from './index.module.scss';

interface SafeAreaBarProps {
  isWhiteBg?: boolean;
  inset?: 'top' | 'bottom';
}

const SafeAreaBar = (props: SafeAreaBarProps) => {
  const { isWhiteBg = false, inset = 'top' } = props;
  return (
    <View
      className={clsx(styles.safeAreaBarWrapper, {
        [styles.whiteBg]: isWhiteBg,
        [styles.isTop]: inset === 'top',
        [styles.isBottom]: inset === 'bottom',
      })}
      style={{ height: inset === 'top' ? STATUS_BAR_HEIGHT : undefined }} // 微信开发者工具上 safe-area-inset-top 没效果（但真机似乎可以s）
    />
  );
};

export { SafeAreaBar };
