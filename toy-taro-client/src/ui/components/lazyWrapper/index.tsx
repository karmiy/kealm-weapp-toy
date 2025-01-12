import { PropsWithChildren, useRef } from 'react';
import { RenderWrapper } from '../renderWrapper';
import styles from './index.module.scss';

interface LazyWrapperProps {
  className?: string;
  visible?: boolean;
}

const LazyWrapper = (props: PropsWithChildren<LazyWrapperProps>) => {
  const { className, visible = false, children } = props;
  const lazyRef = useRef(visible);

  if (visible && !lazyRef.current) {
    lazyRef.current = true;
  }

  return (
    <RenderWrapper className={className} visible={visible} unmountOnExit={!lazyRef.current}>
      {children}
    </RenderWrapper>
  );
};

export { LazyWrapper };
