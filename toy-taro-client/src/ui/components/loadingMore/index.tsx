import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Icon } from '../icon';
import styles from './index.module.scss';

interface LoadingMoreProps {
  className?: string;
  loading?: boolean;
}

const LoadingMore = (props: LoadingMoreProps) => {
  const { className, loading = false } = props;

  if (!loading) {
    return null;
  }

  return (
    <View className={clsx(styles.wrapper, className)}>
      <Icon name='loading' size={20} color={COLOR_VARIABLES.COLOR_RED} />
    </View>
  );
};

export { LoadingMore };
