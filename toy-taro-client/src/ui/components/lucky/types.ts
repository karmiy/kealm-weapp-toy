export interface Prize {
  id: string;
  text: string;
  type: 'coupon' | 'points' | 'none';
  range: number;
}

export interface LuckyRef {
  play: (checkPermission?: boolean) => void;
  stop: (index: number) => void;
}
