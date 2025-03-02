export function getRangeItems<T>(list: T[], range: [number, number]): T[] {
  const [start, end] = range;

  // 处理区间超出数组范围的情况
  const clampedStart = Math.max(0, Math.min(start, list.length - 1));
  const clampedEnd = Math.max(0, Math.min(end, list.length - 1));

  // 确定区间的起点和终点
  const isAscending = clampedStart <= clampedEnd;
  const actualStart = isAscending ? clampedStart : clampedEnd;
  const actualEnd = isAscending ? clampedEnd : clampedStart;

  // 提取区间内的项
  const items = list.slice(actualStart, actualEnd + 1);

  // 如果区间是降序，则反转结果
  return isAscending ? items : items.reverse();
}
