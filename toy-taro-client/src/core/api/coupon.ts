import { COUPON_VALIDITY_TIME_TYPE } from '../constants';
import { CouponEntity } from '../entity';
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
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.DELETE_COUPON })
  static async deleteCoupon(id: string): Promise<void> {
    return Promise.resolve();
  }

  @mock({ name: MOCK_API_NAME.UPDATE_COUPON })
  static async updateCoupon(coupon: CouponApiUpdateParams): Promise<CouponEntity> {
    return Promise.resolve({} as CouponEntity);
  }
}
