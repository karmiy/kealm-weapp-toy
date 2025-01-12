import { PropsWithChildren } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { AtFloatLayout } from 'taro-ui';
import { Icon } from '../icon';
import { SafeAreaBar } from '../safeAreaBar';
import styles from './index.module.scss';

interface FloatLayoutProps extends PropsWithChildren {
  visible?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  maxHeight?: number;
}

const FloatLayout = (props: FloatLayoutProps) => {
  const { visible = false, onClose, title, maxHeight, children } = props;

  return (
    <AtFloatLayout
      className={styles.floatLayoutWrapper}
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
