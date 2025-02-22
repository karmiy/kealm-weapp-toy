import { createContext } from 'react';
import { Rect } from '@shared/utils/dom';
import { DRAG_DIRECTION } from './constants';

interface SortableListContextProp {
  onTouchStart: (e: any, index: number) => void;
  onTouchMove: (e: any) => void;
  onTouchEnd: (e: any) => void;
  dragging: boolean;
  direction: DRAG_DIRECTION;
  startIndex: number;
  endIndex: number;
  transform: number;
  getItemRects: () => Rect[];
}

export const SortableListContext = createContext<SortableListContextProp>({
  onTouchStart: () => {},
  onTouchMove: () => {},
  onTouchEnd: () => {},
  dragging: false,
  direction: DRAG_DIRECTION.DOWN,
  startIndex: 0,
  endIndex: 0,
  transform: 0,
  getItemRects: () => [],
});
