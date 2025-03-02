export interface Prize {
  id: string;
  text: string;
  type: 'coupon' | 'points' | 'none';
  range: number;
}
