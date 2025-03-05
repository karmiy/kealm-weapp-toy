export interface Prize {
  id: string;
  text: string;
  type: 'coupon' | 'points' | 'none';
  range: number;
}

export interface LuckyRef {
  play: () => void;
  stop: (index: number) => void;
}
