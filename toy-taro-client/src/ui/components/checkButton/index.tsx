import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { useValue } from '@/ui/hooks';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Icon } from '../icon';
import styles from './index.module.scss';

interface CheckButtonProps {
  className?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}

const CheckButton = (props: CheckButtonProps) => {
  const { className, checked, onChange } = props;
  const [currentChecked, setCurrentChecked] = useValue<boolean>({
    value: checked,
    defaultValue: false,
    onChange,
  });

  return (
    <View
      className={clsx(styles.wrapper, className)}
      onClick={() => setCurrentChecked(!currentChecked)}
    >
      <Icon
        size={20}
        color={COLOR_VARIABLES.COLOR_RED}
        name={currentChecked ? 'check' : 'uncheck'}
      />
    </View>
  );
};

export { CheckButton };
