import { View } from '@tarojs/components';
import type { IconNames, IconProps } from '../iconfont';
import IconFont from '../iconfont';
import styles from './index.module.scss';

const Icon = (props: IconProps) => {
  const { size = 14 } = props;

  const IconComp = <IconFont {...props} size={size * 2} />;
  if (props.name === 'loading') {
    return <View className={styles.loading}>{IconComp}</View>;
  }
  return IconComp;
};

export { Icon, IconProps, IconNames };
