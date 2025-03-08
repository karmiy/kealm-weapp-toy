export function weightedRandomIndex(items: { range: number }[]): number {
  const prefixSums: number[] = [];
  let totalWeight = 0;

  for (const item of items) {
    totalWeight += item.range;
    prefixSums.push(totalWeight);
  }

  const rand = Math.random() * totalWeight;

  // 使用二分查找找到 rand 落入的区间
  let left = 0,
    right = prefixSums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (rand < prefixSums[mid]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}
