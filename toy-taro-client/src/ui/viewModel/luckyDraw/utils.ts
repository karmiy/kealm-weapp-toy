export function groupByRange<T extends { range: number }>(arr: T[]) {
  return arr
    .sort((a, b) => a.range - b.range) // 按 range 升序排序
    .reduce((acc, item) => {
      const lastGroup = acc[acc.length - 1];
      if (lastGroup && lastGroup[0].range === item.range) {
        lastGroup.push(item);
      } else {
        acc.push([item]);
      }
      return acc;
    }, [] as T[][]);
}

export function uniqueById<T extends { id: string }>(arr: T[]) {
  return [...new Map(arr.map(item => [item.id, item])).values()];
}
