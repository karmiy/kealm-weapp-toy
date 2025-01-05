// 定义内置的颜色映射表
const COLOR_NAMES: Record<string, string> = {
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  black: '#000000',
  white: '#FFFFFF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  // 可根据需要扩展更多颜色
};

export const colorToRgba = (hex: string, alpha: number) => {
  hex = COLOR_NAMES[hex] ?? hex;
  // 去掉 "#" 符号
  const cleanHex = hex.replace('#', '');

  // 分别解析 R、G、B 的值
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // 返回 rgba 格式
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
