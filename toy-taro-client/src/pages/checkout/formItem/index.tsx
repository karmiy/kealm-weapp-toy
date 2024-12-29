import { Text, View } from '@tarojs/components';
import clsx from 'clsx';
import { Icon } from '@/components';
import { COLOR_VARIABLES } from '@/utils/constants';
import styles from './index.module.scss';

interface FormItemProps {
  label: string;
  text: string;
  mode?: 'text' | 'select';
  highlight?: boolean;
  emphasize?: boolean;
  onClick?: () => void;
}

const FormItem = (props: FormItemProps) => {
  const { label, mode = 'text', text, highlight, emphasize, onClick } = props;
  return (
    <View className={styles.wrapper} onClick={onClick}>
      <Text>{label}</Text>
      <View
        className={clsx(styles.text, {
          [styles.isHighlight]: highlight,
          [styles.isEmphasize]: emphasize,
        })}
      >
        {text}
        {mode === 'select' ? (
          <View className={styles.select}>
            <Icon
              name='arrow-right'
              color={highlight ? COLOR_VARIABLES.COLOR_RED : COLOR_VARIABLES.TEXT_COLOR_BASE}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export { FormItem };
