import { PropsWithChildren, useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import { Icon } from '../icon';
import styles from './index.module.scss';

interface StatusViewProps {
  className?: string;
  type: 'loading' | 'empty';
  size?: 'flex' | 'fill' | { width?: number; height?: number };
}

interface StatusWrapperProps extends Omit<StatusViewProps, 'type'> {
  loading?: boolean;
  count?: number;
}

const emptyStyle = {};

const StatusView = (props: StatusViewProps) => {
  const { className, type, size } = props;
  const sizeStyle = typeof size === 'object' ? size : emptyStyle;

  const LoadingStatus = useMemo(() => {
    if (type !== 'loading') {
      return null;
    }
    return (
      <>
        <View>
          <Icon name='loading' size={32} color={COLOR_VARIABLES.COLOR_RED} />
        </View>
        <Text className={styles.tip}>请稍等~</Text>
      </>
    );
  }, [type]);

  const EmptyStatus = useMemo(() => {
    if (type !== 'empty') {
      return null;
    }
    return (
      <>
        <View className={styles.emptyIcon}>
          <Icon name='empty' size={32} color={COLOR_VARIABLES.COLOR_RED} />
        </View>
        <Text className={styles.tip}>这里什么也没有~</Text>
      </>
    );
  }, [type]);

  return (
    <View
      className={clsx(
        styles.statusViewWrapper,
        { [styles.isFlex]: size === 'flex', [styles.isFill]: size === 'fill' },
        className,
      )}
      style={sizeStyle}
    >
      {LoadingStatus}
      {EmptyStatus}
    </View>
  );
};

const StatusWrapper = (props: PropsWithChildren<StatusWrapperProps>) => {
  const { loading, count, children, ...rest } = props;

  if (loading && !count) {
    return <StatusView {...rest} type='loading' />;
  }
  if (!loading && !count) {
    return <StatusView {...rest} type='empty' />;
  }
  return children;
};

export { StatusView, StatusWrapper };
