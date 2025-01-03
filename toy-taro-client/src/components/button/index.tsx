import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { OsButton, OsButtonProps } from 'ossaui';
import styles from './index.module.scss';

const Button = (props: OsButtonProps) => {
  const { className, type = 'primary', disabled, ...rest } = props;

  return (
    <View className={clsx(styles.wrapper, { [styles.isDisabled]: disabled }, className)}>
      <OsButton type={type} {...rest} />
    </View>
  );
};

export { Button };
