import { PRIZE_TYPE } from '../constants';
import { CouponEntity } from './coupon';

export interface PrizeEntity {
  id: string;
  type: PRIZE_TYPE;
  coupon?: CouponEntity;
  points?: number;
  sort_value: number;
  create_time: number;
  last_modified_time: number;
}
