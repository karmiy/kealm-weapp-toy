import { PropsWithChildren } from 'react';
import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import { Icon } from '@ui/components';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import styles from './index.module.scss';

interface FormItemProps {
  title: string;
  required?: boolean;
  showSettingEntrance?: boolean;
  onSettingClick?: () => void;
}

const FormItem = (props: PropsWithChildren<FormItemProps>) => {
  const { title, required = false, showSettingEntrance = false, onSettingClick, children } = props;

  return (
    <View className={styles.formItemWrapper}>
      <View className={styles.title}>
        <Text className={styles.text}>{title}</Text>
        {required ? <Text className={styles.required}>*</Text> : null}
        {showSettingEntrance ? (
          <View onClick={onSettingClick}>
            <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} />
          </View>
        ) : null}
      </View>
      <View className={styles.content}>{children}</View>
    </View>
  );
};

export { FormItem };
