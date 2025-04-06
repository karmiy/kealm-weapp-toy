import { COUPON_VALIDITY_TIME_TYPE } from '../constants';
import { CouponEntity, UserCouponEntity } from '../entity';
import { httpRequest } from '../httpRequest';
import { mock, MOCK_API_NAME } from '../mock';

export type CouponApiUpdateParams = Pick<
  CouponEntity,
  'name' | 'minimum_order_value' | 'type' | 'value'
> & {
  id?: string;
  validity_time_type: COUPON_VALIDITY_TIME_TYPE;
  dates?: string[];
  days?: number[];
  start_time?: string;
  end_time?: string;
};

export class CouponApi {
  @mock({ name: MOCK_API_NAME.GET_COUPON_LIST })
  static async getCouponList(): Promise<CouponEntity[]> {
    return httpRequest.get<CouponEntity[]>({
      url: '/coupon/getCouponList',
    });
  }

  @mock({ name: MOCK_API_NAME.GET_USER_COUPON_LIST })
  static async getUserCouponList(): Promise<UserCouponEntity[]> {
    return httpRequest.get<UserCouponEntity[]>({
      url: '/coupon/getUserCouponList',
    });
  }

  @mock({ name: MOCK_API_NAME.GET_GROUP_USER_COUPON_LIST })
  static async getGroupUserCouponList(): Promise<UserCouponEntity[]> {
    return httpRequest.get<UserCouponEntity[]>({
      url: '/coupon/getGroupUserCouponList',
    });
  }

  @mock({ name: MOCK_API_NAME.DELETE_COUPON })
  static async deleteCoupon(id: string): Promise<void> {
    return httpRequest.post<void>({
      url: '/coupon/deleteCoupon',
      data: { id },
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_COUPON })
  static async updateCoupon(coupon: CouponApiUpdateParams): Promise<CouponEntity> {
    return httpRequest.post<CouponEntity>({
      url: '/coupon/updateCoupon',
      data: coupon,
    });
  }
}
