import { PropsWithChildren, useCallback, useRef } from 'react';
import { Block, View } from '@tarojs/components';
import { nextTick } from '@tarojs/taro';
import { clsx } from 'clsx';
import { getBoundingClientRect, Rect } from '@shared/utils/dom';
import { useGetSet } from '@ui/hooks';
import { DRAG_DIRECTION } from './constants';
import { SortableListContext } from './context';
import { SortableItem, sortableItemStyles } from './sortableItem';
import { getTouchedIndex } from './utils';
import styles from './index.module.scss';

// const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
//   const nextList = [...list];
//   const [removedItem] = nextList.splice(oldIndex, 1);
//   nextList.splice(newIndex, 0, removedItem);
//   setList(nextList);
// };

interface SortableListProps {
  className?: string;
  style?: React.CSSProperties;
  onSortEnd?: (params: { oldIndex: number; newIndex: number }) => void;
}

const SortableList = (props: PropsWithChildren<SortableListProps>) => {
  const { className, style, children, onSortEnd } = props;
  const wrapperRef = useRef<{ ctx: TaroGeneral.IAnyObject }>(null);
  const itemRectsRef = useRef<Rect[]>([]);
  const areaPageRef = useRef<{ min: number; max: number } | null>(null);
  const touchInfoRef = useRef({
    startReady: false,
  });

  const [getStartY, setStartY] = useGetSet(0);
  const [getStartIndex, setStartIndex] = useGetSet(0);
  const [getEndIndex, setEndIndex] = useGetSet(0);
  const startIndex = getStartIndex();
  const endIndex = getEndIndex();
  const [getDraggingData, setDraggingData] = useGetSet({
    dragging: false,
    direction: DRAG_DIRECTION.UP,
    y: 0,
    delta: 0,
    transform: 0,
  });
  const draggingData = getDraggingData();
  const draggingPromiseTaskRef = useRef<Promise<void> | null>(null);

  const getSortItemRects = useCallback(async () => {
    const wrapperCtx = wrapperRef.current?.ctx;
    const rects = await getBoundingClientRect({
      component: wrapperCtx,
      className: sortableItemStyles.sortableItem,
      selectAll: true,
    });
    return rects;
  }, []);

  const getSortListWrapperRect = useCallback(async () => {
    const wrapperCtx = wrapperRef.current?.ctx;
    const rect = await getBoundingClientRect({
      component: wrapperCtx,
      className: styles.sortableListWrapper,
    });
    return rect;
  }, []);

  const onTouchStart = useCallback(
    async (e: any, index: number) => {
      e.stopPropagation();
      const { pageY } = e.changedTouches[0];
      const itemRects = await getSortItemRects();
      itemRectsRef.current = itemRects;
      const listWrapperRect = await getSortListWrapperRect();
      setStartY(pageY);
      setStartIndex(index);
      const minPageY = listWrapperRect.top + (pageY - itemRects[index].top);
      const maxPageY = listWrapperRect.bottom - (itemRects[index].bottom - pageY);
      areaPageRef.current = { min: minPageY, max: maxPageY };
      touchInfoRef.current.startReady = true;
    },
    [getSortItemRects, setStartIndex, setStartY, getSortListWrapperRect],
  );

  const updateEndIndex = useCallback(
    (direction: DRAG_DIRECTION, delta: number) => {
      const startIdx = getStartIndex();
      const startAxis =
        (direction === DRAG_DIRECTION.DOWN
          ? itemRectsRef.current[startIdx]?.bottom
          : itemRectsRef.current[startIdx]?.top) ?? getStartY();
      const nextIdx = getTouchedIndex({
        rects: itemRectsRef.current,
        startIndex: startIdx,
        startAxis,
        direction,
        delta,
      });
      setEndIndex(nextIdx);
    },
    [getStartIndex, getStartY, setEndIndex],
  );

  const onTouchMove = useCallback(
    (e: any) => {
      e.stopPropagation();
      // 注：小程序开始拖拽到触发 touchmove 需要至少移动一小段间隔
      if (!touchInfoRef.current.startReady) {
        // touch start 时需要计算元素信息
        return;
      }
      draggingPromiseTaskRef.current = new Promise(resolve => {
        nextTick(() => {
          const { pageY } = e.changedTouches[0];
          const boundaryPageY = areaPageRef.current
            ? Math.max(Math.min(pageY, areaPageRef.current.max), areaPageRef.current.min)
            : pageY;
          const startAxis = getStartY();
          const direction = pageY > startAxis ? DRAG_DIRECTION.DOWN : DRAG_DIRECTION.UP;
          const transform = boundaryPageY - startAxis;
          const delta = Math.abs(transform);
          setDraggingData({
            dragging: true,
            direction,
            y: pageY,
            delta,
            transform,
          });
          updateEndIndex(direction, delta);
          resolve();
        });
      });
    },
    [getStartY, setDraggingData, updateEndIndex],
  );

  const onTouchEnd = useCallback(
    async (e: any) => {
      e.stopPropagation();
      await draggingPromiseTaskRef.current;
      draggingPromiseTaskRef.current = null;
      setDraggingData({
        dragging: false,
        direction: DRAG_DIRECTION.UP,
        y: 0,
        delta: 0,
        transform: 0,
      });
      onSortEnd?.({
        oldIndex: getStartIndex(),
        newIndex: getEndIndex(),
      });
      setStartY(0);
      setStartIndex(0);
      setEndIndex(0);
      touchInfoRef.current.startReady = false;
    },
    [setDraggingData, onSortEnd, getStartIndex, getEndIndex, setStartY, setStartIndex, setEndIndex],
  );

  return (
    <SortableListContext.Provider
      value={{
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        dragging: draggingData.dragging,
        direction: draggingData.direction,
        startIndex,
        endIndex,
        transform: draggingData.transform,
        getItemRects: () => itemRectsRef.current,
      }}
    >
      <View ref={wrapperRef} className={clsx(styles.sortableListWrapper, className)} style={style}>
        <Block>{children}</Block>
      </View>
    </SortableListContext.Provider>
  );
};

export { SortableList, SortableItem };
