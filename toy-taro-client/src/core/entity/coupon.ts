import { COUPON_STATUS, COUPON_TYPE } from '../constants';

export type CouponValidityDateRange = {
  start_time: number;
  end_time: number;
};

export type CouponValidityDateList = {
  dates: number[];
};

export type CouponValidityWeekly = {
  days: number[];
};

export type CouponValidityTime =
  | CouponValidityDateRange
  | CouponValidityDateList
  | CouponValidityWeekly;

export interface CouponEntity {
  id: string;
  name: string;
  user_id: string;
  create_time: number;
  validity_time: CouponValidityTime;
  status: COUPON_STATUS;
  type: COUPON_TYPE;
  value: number; // 满减是数值，打折券是比例，如 88 是 8.8 折
  minimum_order_value: number; // 最低使用门槛
}
