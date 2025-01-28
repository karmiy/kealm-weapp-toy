import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { Button as TaroButton, ITouchEvent, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { Undefinable } from '@shared/types';
import { colorToRgba } from '@shared/utils/color';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Icon, IconNames } from '../icon';
import styles from './index.module.scss';

interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  type?: 'primary' | 'plain';
  width?: number | string;
  size?: 'large' | 'medium' | 'small' | 'mini';
  icon?: IconNames;
  color?: string;
  bgColor?: string;
  disabled?: boolean;
  radius?: boolean;
  circle?: boolean;
  onClick?: (e: ITouchEvent) => void;
}

const ICON_SIZE = {
  large: 14,
  medium: 14,
  small: 12,
  mini: 8,
};

const Button = (props: PropsWithChildren<ButtonProps>) => {
  const {
    className,
    style,
    type = 'primary',
    width,
    size = 'medium',
    icon,
    color,
    bgColor,
    disabled,
    radius = true,
    circle = true,
    onClick,
    children,
  } = props;

  const customStyles = useMemo(() => {
    const baseStyles: Record<string, Undefinable<string>> = {
      '--button-plain-active-color': colorToRgba(color ?? COLOR_VARIABLES.COLOR_RED, 0.1),
    };
    if (!color) {
      return baseStyles;
    }
    if (type === 'primary') {
      return {
        ...baseStyles,
        borderColor: color,
        backgroundColor: bgColor || color,
      };
    }
    if (type === 'plain') {
      return {
        ...baseStyles,
        borderColor: color,
        color: color,
        backgroundColor: bgColor,
      };
    }
    return baseStyles;
  }, [color, type, bgColor]);

  const [active, setActive] = useState(false);

  const onTouchStart = useCallback(() => {
    if (disabled) {
      return;
    }
    setActive(true);
  }, [disabled]);

  const onTouchEnd = useCallback(() => {
    if (disabled) {
      return;
    }
    setActive(false);
  }, [disabled]);

  const IconComp = useMemo(() => {
    if (!icon) {
      return null;
    }
    const iconColor =
      type === 'plain' ? color ?? COLOR_VARIABLES.COLOR_RED : COLOR_VARIABLES.COLOR_WHITE;
    return (
      <View
        className={clsx(styles.icon, {
          [styles.isLarge]: size === 'large',
          [styles.isMedium]: size === 'medium',
          [styles.isSmall]: size === 'small',
          [styles.isMini]: size === 'mini',
          // [styles.isLoading]: icon === 'loading',
        })}
      >
        <Icon name={icon} color={iconColor} size={ICON_SIZE[size]} />
      </View>
    );
  }, [color, icon, type, size]);

  return (
    <TaroButton
      className={clsx(
        styles.buttonWrapper,
        {
          [styles.isPlain]: type === 'plain',
          [styles.isPrimary]: type === 'primary',
          [styles.isLarge]: size === 'large',
          [styles.isMedium]: size === 'medium',
          [styles.isSmall]: size === 'small',
          [styles.isMini]: size === 'mini',
          [styles.isDisabled]: disabled,
          [styles.isRadius]: radius,
          [styles.isCircle]: circle,
          [styles.isActive]: active,
        },
        className,
      )}
      style={{
        ...customStyles,
        ...style,
        width,
      }}
      onClick={!disabled ? onClick : undefined}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {IconComp}
      <View className={styles.text}>{children}</View>
    </TaroButton>
  );
};

export { Button };
