import { CouponEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class CouponApi {
  @mock({ name: MOCK_API_NAME.GET_COUPON_LIST, enable: true })
  static async getCouponList(): Promise<CouponEntity[]> {
    return Promise.resolve([]);
  }
}
