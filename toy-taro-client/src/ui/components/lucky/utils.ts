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

export const pxGetter =
  (rect: number, reference = 300) =>
  (px: number, unit?: boolean) => {
    const value = Math.round((px / reference) * rect);
    return unit ? `${value}px` : value;
  };

export const getImgSrc = (type: 'coupon' | 'points' | 'none') => {
  return type === 'none'
    ? 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-sad.png'
    : type === 'coupon'
    ? 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-coupon.png'
    : 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-red-envelop.png';
};

export function generateBoundaryCoords(row: number, col: number) {
  const result: { x: number; y: number }[] = [];

  // Top row (left to right)
  for (let x = 0; x < col; x++) {
    result.push({ x, y: 0 });
  }

  // Right column (top to bottom, excluding first corner)
  for (let y = 1; y < row; y++) {
    result.push({ x: col - 1, y });
  }

  // Bottom row (right to left, excluding last corner)
  for (let x = col - 2; x >= 0; x--) {
    result.push({ x, y: row - 1 });
  }

  // Left column (bottom to top, excluding first and last corners)
  for (let y = row - 2; y > 0; y--) {
    result.push({ x: 0, y });
  }

  return result;
}

export function generateSpiralCoords(row: number, col: number) {
  const result: { x: number; y: number }[] = [];
  let left = 0,
    right = col - 1,
    top = 0,
    bottom = row - 1;

  while (left <= right && top <= bottom) {
    // Top row (left to right)
    for (let x = left; x <= right; x++) result.push({ x, y: top });
    top++;

    // Right column (top to bottom)
    for (let y = top; y <= bottom; y++) result.push({ x: right, y });
    right--;

    // Bottom row (right to left)
    if (top <= bottom) {
      for (let x = right; x >= left; x--) result.push({ x, y: bottom });
      bottom--;
    }

    // Left column (bottom to top)
    if (left <= right) {
      for (let y = bottom; y >= top; y--) result.push({ x: left, y });
      left++;
    }
  }

  return result;
}

export function generateWheelColors(n: number, colorList: string[]) {
  const isEven = n % 2 === 0;
  const colorCount = isEven ? 2 : 3;
  const colors: string[] = [];

  // 基础颜色分配
  for (let i = 0; i < n; i++) {
    colors.push(colorList[i % colorCount]);
  }

  // 奇数时校验首尾颜色
  if (!isEven && colors[0] === colors[n - 1]) {
    const previousColor = colors[n - 2]; // 倒数第二格颜色
    // 找到既不是首色，也不是前一个颜色的候选色
    const availableColors = colorList.filter(c => c !== colors[0] && c !== previousColor);
    colors[n - 1] = availableColors.length > 0 ? availableColors[0] : colorList[0];
  }

  return colors;
}
