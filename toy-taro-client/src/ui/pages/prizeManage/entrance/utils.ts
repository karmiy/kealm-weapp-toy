export function getRangeItems<T>(list: T[], range: [number, number]): T[] {
  const [start, end] = range;

  // 处理区间超出数组范围的情况
  const clampedStart = Math.max(0, Math.min(start, list.length - 1));
  const clampedEnd = Math.max(0, Math.min(end, list.length - 1));

  // 确定区间的起点和终点
  const actualStart = Math.min(clampedStart, clampedEnd);
  const actualEnd = Math.max(clampedStart, clampedEnd);

  // 提取区间内的项
  return list.slice(actualStart, actualEnd + 1);
}
