import { PropsWithChildren, useContext } from 'react';
import { ScrollView } from '@tarojs/components';
import clsx from 'clsx';
import { LazyWrapper } from '../../lazyWrapper';
import { RenderWrapper } from '../../renderWrapper';
import { TabsContext } from '../context';
import styles from './index.module.scss';

interface TabPanelProps {
  className?: string;
  label: string;
  visible?: boolean;
  lazy?: boolean;
}

const TabPanel = (props: PropsWithChildren<TabPanelProps>) => {
  const { className, visible, lazy = true, children } = props;
  const { mode } = useContext(TabsContext);
  const isHorizontal = mode === 'horizontal';
  const isVertical = mode === 'vertical';

  const WrapperComponent = lazy ? LazyWrapper : RenderWrapper;

  return (
    <WrapperComponent
      className={clsx(styles.wrapper, { [styles.isVertical]: isVertical }, className)}
      visible={visible}
    >
      {isVertical ? (
        <ScrollView scrollY className={styles.scrollView} enableFlex>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </WrapperComponent>
  );
};

export { TabPanel, TabPanelProps };
