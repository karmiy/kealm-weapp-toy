import { DRAG_DIRECTION } from './constants';

export function getTouchedIndex(params: {
  rects: { top: number; bottom: number; height: number }[];
  startIndex: number;
  startAxis: number;
  direction: DRAG_DIRECTION;
  delta: number;
}): number {
  const { rects, startIndex, startAxis, direction, delta } = params;
  let currentIndex = startIndex;
  const currentPos = startAxis + (direction === DRAG_DIRECTION.DOWN ? delta : -delta);
  const isMovingDown = direction === DRAG_DIRECTION.DOWN;

  while ((isMovingDown && currentIndex < rects.length - 1) || (!isMovingDown && currentIndex > 0)) {
    const nextIndex = isMovingDown ? currentIndex + 1 : currentIndex - 1;
    const nextRect = rects[nextIndex];
    if (!nextRect) break;
    const threshold = nextRect.top + nextRect.height / 2;

    if ((isMovingDown && currentPos >= threshold) || (!isMovingDown && currentPos <= threshold)) {
      currentIndex = nextIndex;
    } else {
      break;
    }
  }

  return currentIndex;
}
