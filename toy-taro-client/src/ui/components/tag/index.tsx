import { PropsWithChildren, useMemo } from 'react';
import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Icon, IconNames } from '../icon';
import styles from './index.module.scss';

interface TagProps {
  className?: string;
  color?: 'primary';
  type: 'solid' | 'outline';
  icon?: IconNames;
  onClick?: () => void;
  onDelete?: () => void;
}

const Tag = (props: PropsWithChildren<TagProps>) => {
  const {
    className,
    color = 'primary',
    type = 'outline',
    children,
    icon,
    onClick,
    onDelete,
  } = props;

  const iconColor = useMemo(() => {
    if (type === 'solid') {
      return COLOR_VARIABLES.COLOR_WHITE;
    }
    if (color === 'primary') {
      return COLOR_VARIABLES.COLOR_RED;
    }
    return 'inherit';
  }, [color, type]);

  return (
    <View
      className={clsx(
        styles.tagWrapper,
        {
          [styles.isPrimary]: color === 'primary',
          [styles.isOutline]: type === 'outline',
          [styles.isSolid]: type === 'solid',
        },
        className,
      )}
      onClick={onClick}
    >
      {icon && <Icon name={icon} color={iconColor} size={12} />}
      {children}
      {onDelete && (
        <View className={styles.deleteIcon} onClick={onDelete}>
          <Icon name='close' color={iconColor} size={12} />
        </View>
      )}
    </View>
  );
};

export { Tag };
