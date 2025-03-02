import { PRIZE_TYPE } from '../constants';

export interface PrizeEntity {
  id: string;
  type: PRIZE_TYPE;
  coupon_id?: string;
  points?: number;
  draw_count?: number;
  text?: string;
  sort_value: number;
  create_time: number;
  last_modified_time: number;
}
