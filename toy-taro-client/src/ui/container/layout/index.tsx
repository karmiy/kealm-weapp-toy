import { PropsWithChildren } from 'react';
import { ScrollView, ScrollViewProps, View } from '@tarojs/components';
import clsx from 'clsx';
import { SafeAreaBar } from '@ui/components';
import styles from './index.module.scss';

interface LayoutProps {
  className?: string;
  type: 'card';
  scrollViewProps?: ScrollViewProps;
}

const Layout = (props: PropsWithChildren<LayoutProps>) => {
  const { className, type, scrollViewProps, children } = props;

  return (
    <View className={clsx(styles.layoutWrapper, className)}>
      <ScrollView scrollY className={styles.scrollView} {...scrollViewProps}>
        {type === 'card' ? (
          <View className={styles.cardContainer}>
            <View className={styles.cardList}>{children}</View>
            <SafeAreaBar inset='bottom' />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export { Layout };
