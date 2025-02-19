import { PropsWithChildren } from 'react';
import { ScrollView, ScrollViewProps, View } from '@tarojs/components';
import clsx from 'clsx';
import { SafeAreaBar } from '@ui/components';
import styles from './index.module.scss';

interface LayoutProps {
  className?: string;
  classes?: { scrollView?: string; container?: string; cardList?: string };
  type: 'card' | 'plain';
  scrollViewProps?: ScrollViewProps;
}

const Layout = (props: PropsWithChildren<LayoutProps>) => {
  const { className, classes, type, scrollViewProps, children } = props;

  return (
    <View className={clsx(styles.layoutWrapper, className)}>
      <ScrollView
        scrollY
        className={clsx(styles.scrollView, classes?.scrollView)}
        {...scrollViewProps}
      >
        {type === 'card' ? (
          <View className={clsx(styles.cardContainer, classes?.container)}>
            <View className={clsx(styles.cardList, classes?.cardList)}>{children}</View>
            <SafeAreaBar inset='bottom' />
          </View>
        ) : null}
        {type === 'plain' ? (
          <View className={clsx(styles.plainContainer, classes?.container)}>
            {children}
            <SafeAreaBar inset='bottom' />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export { Layout };
