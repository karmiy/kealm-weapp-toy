import { useCallback } from 'react';
import { View } from '@tarojs/components';
import clsx from 'clsx';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { useValue } from '@ui/hooks';
import { Icon } from '../icon';
import styles from './index.module.scss';

interface StepperProps {
  step?: number;
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const Stepper = (props: StepperProps) => {
  const { step = 1, max = 9999, min = 1, value, onChange } = props;
  const [currentValue, setCurrentValue] = useValue<number>({
    value,
    defaultValue: min,
    onChange,
  });

  const handleMinus = useCallback(() => {
    const next = currentValue - step;
    setCurrentValue(Math.max(min, next));
  }, [currentValue, min, setCurrentValue, step]);

  const handlePlus = useCallback(() => {
    const next = currentValue + step;
    setCurrentValue(Math.min(max, next));
  }, [currentValue, max, setCurrentValue, step]);

  const isMinusDisabled = currentValue! <= min;
  const isPlusDisabled = currentValue! >= max;

  return (
    <View className={styles.wrapper}>
      <View
        className={clsx(styles.action, { [styles.isDisabled]: isMinusDisabled })}
        onClick={handleMinus}
      >
        <Icon
          name='minus'
          color={!isMinusDisabled ? COLOR_VARIABLES.COLOR_RED : COLOR_VARIABLES.TEXT_COLOR_DISABLED}
        />
      </View>
      <View className={styles.count}>{currentValue}</View>
      <View
        className={clsx(styles.action, { [styles.isDisabled]: isPlusDisabled })}
        onClick={handlePlus}
      >
        <Icon
          name='add'
          color={!isPlusDisabled ? COLOR_VARIABLES.COLOR_RED : COLOR_VARIABLES.TEXT_COLOR_DISABLED}
        />
      </View>
    </View>
  );
};

export { Stepper };
