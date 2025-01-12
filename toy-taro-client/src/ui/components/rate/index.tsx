import { useMemo } from 'react';
import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { useValue } from '@/ui/hooks';
import { COLOR_VARIABLES } from '@shared/utils/constants';
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
  const [currentChecked, setCurrentChecked] = useValue<number>({
    value,
    defaultValue: 0,
    onChange,
  });

  const Stars = useMemo(() => {
    return Array.from({ length: max }).map((_, index) => {
      const isActive = index <= currentChecked;
      const style = { marginLeft: index ? space : 0 };
      return (
        <View key={index} onClick={() => setCurrentChecked(index)} style={style}>
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
  }, [currentChecked, max, setCurrentChecked, size, space]);

  return <View className={clsx(styles.wrapper, className)}>{Stars}</View>;
};

export { Rate };
