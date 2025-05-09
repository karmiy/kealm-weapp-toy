import { COUPON_STATUS, COUPON_TYPE, COUPON_VALIDITY_TIME_TYPE } from '../constants';

export type CouponValidityDateRange = {
  type: COUPON_VALIDITY_TIME_TYPE.DATE_RANGE;
  start_time: number;
  end_time: number;
};

export type CouponValidityDateList = {
  type: COUPON_VALIDITY_TIME_TYPE.DATE_LIST;
  dates: number[];
};

export type CouponValidityWeekly = {
  type: COUPON_VALIDITY_TIME_TYPE.WEEKLY;
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
  last_modified_time: number;
  validity_time: CouponValidityTime;
  type: COUPON_TYPE;
  value: number; // 满减是数值，打折券是比例，如 88 是 8.8 折
  minimum_order_value: number; // 最低使用门槛
}

export interface UserCouponEntity {
  id: string;
  coupon_id: string;
  user_id: string;
  create_time: number;
  last_modified_time: number;
  status: COUPON_STATUS;
}
