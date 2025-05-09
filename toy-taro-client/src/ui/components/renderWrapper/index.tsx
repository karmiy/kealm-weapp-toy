import { PropsWithChildren } from 'react';
import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import styles from './index.module.scss';

interface RenderWrapperProps {
  className?: string;
  visible?: boolean;
  unmountOnExit?: boolean;
}

const RenderWrapper = (props: PropsWithChildren<RenderWrapperProps>) => {
  const { className, visible = false, unmountOnExit = false, children } = props;

  if (!visible && unmountOnExit) return null;

  return (
    <View
      className={clsx(
        {
          [styles.hide]: !visible,
        },
        className,
      )}
    >
      {children}
    </View>
  );
};

export { RenderWrapper };
