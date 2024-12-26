import { PropsWithChildren } from 'react';
import { LazyWrapper } from '../../lazyWrapper';
import { RenderWrapper } from '../../renderWrapper';

interface TabPanelProps {
  className?: string;
  label: string;
  visible?: boolean;
  lazy?: boolean;
}

const TabPanel = (props: PropsWithChildren<TabPanelProps>) => {
  const { className, visible, lazy = true, children } = props;

  const WrapperComponent = lazy ? LazyWrapper : RenderWrapper;

  return (
    <WrapperComponent className={className} visible={visible}>
      {children}
    </WrapperComponent>
  );
};

export { TabPanel, TabPanelProps };
