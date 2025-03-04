import { useMemo } from 'react';
import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { useValue } from '@ui/hooks';
import { Icon } from '../icon';
import styles from './index.module.scss';

interface RateProps {
  className?: string;
  size?: number;
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
}

const Rate = (props: RateProps) => {
  const { className, size = 14, value, onChange, max = 5 } = props;
  const space = size / 4;
  const [currentValue, setCurrentValue] = useValue<number>({
    value,
    defaultValue: 0,
    onChange,
  });

  const Stars = useMemo(() => {
    return Array.from({ length: max }).map((_, index) => {
      const v = index + 1;
      const isActive = v <= currentValue;
      const style = { marginLeft: index ? space : 0 };
      return (
        <View key={v} onClick={() => setCurrentValue(v)} style={style}>
          <Icon
            size={size}
            color={
              isActive ? COLOR_VARIABLES.COLOR_RATE_ACTIVE : COLOR_VARIABLES.COLOR_RATE_INACTIVE
            }
            name={isActive ? 'star-fill' : 'star'}
          />
        </View>
      );
    });
  }, [currentValue, max, setCurrentValue, size, space]);

  return <View className={clsx(styles.wrapper, className)}>{Stars}</View>;
};

export { Rate };
