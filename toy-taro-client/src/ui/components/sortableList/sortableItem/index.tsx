import { PropsWithChildren, useContext, useMemo } from 'react';
import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { DRAG_DIRECTION } from '../constants';
import { SortableListContext } from '../context';
import styles from './index.module.scss';

interface SortableItemProps {
  className?: string;
  style?: React.CSSProperties;
  index: number;
}

const SortableItem = (props: PropsWithChildren<SortableItemProps>) => {
  const { className, style, children, index } = props;
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    dragging,
    direction,
    startIndex,
    endIndex,
    transform,
    disabled = false,
    getItemRects,
  } = useContext(SortableListContext);

  const translateY = useMemo(() => {
    if (!dragging) {
      return 'translateY(0px)';
    }
    if (index === startIndex) {
      return `translateY(${transform}px)`;
    }
    const offset = getItemRects()[startIndex]?.height ?? 0;
    if (direction === DRAG_DIRECTION.UP) {
      if (index >= endIndex && index < startIndex) {
        return `translateY(${offset}px)`;
      }
      return 'translateY(0px)';
    } else if (direction === DRAG_DIRECTION.DOWN) {
      if (index <= endIndex && index > startIndex) {
        return `translateY(-${offset}px)`;
      }
      return 'translateY(0px)';
    }
  }, [direction, dragging, endIndex, getItemRects, index, startIndex, transform]);

  return (
    <View
      className={clsx(
        styles.sortableItem,
        {
          [styles.isDragging]: dragging,
          [styles.isActive]: dragging && index === startIndex,
        },
        className,
      )}
      catchMove
      onTouchStart={e => !disabled && onTouchStart(e, index)}
      onTouchMove={e => !disabled && onTouchMove(e)}
      onTouchEnd={e => !disabled && onTouchEnd(e)}
      style={{
        ...style,
        transform: translateY,
      }}
    >
      {children}
    </View>
  );
};

export { SortableItem, styles as sortableItemStyles };
