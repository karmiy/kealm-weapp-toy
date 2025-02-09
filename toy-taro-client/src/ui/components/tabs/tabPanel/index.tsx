import { PropsWithChildren, useContext } from 'react';
import { ScrollView, ScrollViewProps } from '@tarojs/components';
import clsx from 'clsx';
import { LazyWrapper } from '../../lazyWrapper';
import { RenderWrapper } from '../../renderWrapper';
import { TabsContext } from '../context';
import styles from './index.module.scss';

// 初始不渲染参考：https://github.com/karmiy/kealm-react-components/blob/master/packages/components/cores/tabs/tab-pane.jsx

interface TabPanelProps {
  className?: string;
  label: string;
  visible?: boolean;
  lazy?: boolean;
  isScrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
}

const TabPanel = (props: PropsWithChildren<TabPanelProps>) => {
  const {
    className,
    visible,
    lazy = true,
    isScrollable = false,
    scrollViewProps,
    children,
  } = props;
  const { mode } = useContext(TabsContext);
  const isHorizontal = mode === 'horizontal';
  const isVertical = mode === 'vertical';

  const WrapperComponent = lazy ? LazyWrapper : RenderWrapper;

  return (
    <WrapperComponent
      className={clsx(
        styles.wrapper,
        { [styles.isVertical]: isVertical, [styles.isScrollable]: isScrollable },
        className,
      )}
      visible={visible}
    >
      {isVertical || isScrollable ? (
        <ScrollView scrollY className={styles.scrollView} enableFlex {...scrollViewProps}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </WrapperComponent>
  );
};

export { TabPanel, TabPanelProps };
