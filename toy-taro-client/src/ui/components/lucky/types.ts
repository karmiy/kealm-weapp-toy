export interface Prize {
  id: string;
  text: string;
  type: 'coupon' | 'score' | 'none';
  range: number;
}
