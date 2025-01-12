import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Icon } from '../icon';
import { IconNames } from '../iconfont';
import styles from './index.module.scss';

interface IconButtonProps {
  className?: string;
  name: IconNames;
  onClick?: () => void;
}

const IconButton = (props: IconButtonProps) => {
  const { className, name, onClick } = props;

  return (
    <View className={clsx(styles.wrapper, className)} onClick={onClick}>
      <Icon name={name} color={COLOR_VARIABLES.COLOR_RED} size={16} />
    </View>
  );
};

export { IconButton };
