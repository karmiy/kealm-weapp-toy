export const hexToRgba = (hex: string, alpha: number) => {
  // 去掉 "#" 符号
  const cleanHex = hex.replace('#', '');

  // 分别解析 R、G、B 的值
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // 返回 rgba 格式
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
