import { Children, cloneElement, PropsWithChildren, useMemo } from 'react';
import { Block, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { TabsContext } from './context';
import { TabHeader } from './tabHeader';
import { TabPanel, TabPanelProps } from './tabPanel';
import styles from './index.module.scss';

interface TabsProps {
  className?: string;
  style?: React.CSSProperties;
  headerClassName?: string;
  current?: number;
  onChange?: (value: number) => void;
  lazy?: boolean;
  variant?: 'text' | 'contained';
  mode?: 'vertical' | 'horizontal';
}

const Tabs = (props: PropsWithChildren<TabsProps>) => {
  const {
    className,
    headerClassName,
    style,
    current = 0,
    onChange,
    lazy = true,
    variant = 'text',
    mode = 'horizontal',
    children: _children,
  } = props;
  const { children, labels } = useMemo(() => {
    const l: string[] = [];
    const c = Children.map(_children, (child, index) => {
      if (!child) {
        return null;
      }
      const { label } = (child as React.ReactElement<TabPanelProps>).props;
      l.push(label);
      return cloneElement(child as React.ReactElement, { visible: current === index, lazy });
    });
    return {
      children: c,
      labels: l,
    };
  }, [_children, current, lazy]);

  return (
    <TabsContext.Provider value={{ current, variant, mode }}>
      <View
        className={clsx(styles.wrapper, { [styles.isVertical]: mode === 'vertical' }, className)}
        style={style}
      >
        <TabHeader className={headerClassName} items={labels} onChange={onChange} />
        {/* https://juejin.cn/post/7299736066423848994 */}
        {/* scrollView 同级节点有更新会导致 scroll 位置回到 0 */}
        <Block>{children}</Block>
      </View>
    </TabsContext.Provider>
  );
};

export { Tabs, TabPanel };
