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

export const hexToRgba = (hex: string, alpha: number) => {
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

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const bigint = Number.parseInt(hex, 16);
  return {
    r: Math.floor(bigint / 65536) % 256,
    g: Math.floor(bigint / 256) % 256,
    b: bigint % 256,
  };
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`;
};

export function lightenColor(color: string, ratio: number): string {
  if (ratio < 0 || ratio > 1) {
    throw new Error('Ratio must be between 0 and 1');
  }

  const { r, g, b } = hexToRgb(color);

  const newR = Math.round(r + (255 - r) * (1 - ratio));
  const newG = Math.round(g + (255 - g) * (1 - ratio));
  const newB = Math.round(b + (255 - b) * (1 - ratio));

  return rgbToHex(newR, newG, newB);
}
