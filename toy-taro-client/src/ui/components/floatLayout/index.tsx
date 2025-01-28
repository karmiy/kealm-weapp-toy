import { PropsWithChildren } from 'react';
import { ScrollView, View } from '@tarojs/components';
import clsx from 'clsx';
import { AtFloatLayout } from 'taro-ui';
import { Icon } from '../icon';
import { SafeAreaBar } from '../safeAreaBar';
import styles from './index.module.scss';

interface FloatLayoutProps extends PropsWithChildren {
  visible?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  maxHeight?: number;
  className?: string;
}

const FloatLayout = (props: FloatLayoutProps) => {
  const { className, visible = false, onClose, title, maxHeight, children } = props;

  return (
    <AtFloatLayout
      className={clsx(styles.floatLayoutWrapper, className)}
      isOpened={visible}
      onClose={onClose}
      scrollY={false}
    >
      <View className={styles.title}>
        {title}
        <View className={styles.close} onClick={onClose}>
          <Icon size={16} name='close' />
        </View>
      </View>
      <ScrollView scrollY style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}>
        {children}
      </ScrollView>
      <SafeAreaBar inset='bottom' />
    </AtFloatLayout>
  );
};

export { FloatLayout };
