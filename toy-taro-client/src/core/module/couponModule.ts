import { CouponApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';
import { CouponUpdateParams } from '../types';

export class CouponModule extends AbstractModule {
  protected onLoad() {
    this.syncCouponList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.COUPON;
  }

  async syncCouponList() {
    storeManager.startLoading(STORE_NAME.COUPON);
    const couponList = await CouponApi.getCouponList();
    storeManager.refresh(STORE_NAME.COUPON, couponList);
    storeManager.stopLoading(STORE_NAME.COUPON);
  }

  async deleteCoupon(id: string) {
    await CouponApi.deleteCoupon(id);
    storeManager.emitDelete(STORE_NAME.COUPON, [id]);
  }

  async updateCoupon(coupon: CouponUpdateParams) {
    const {
      id,
      name,
      minimumOrderValue,
      type,
      validityTimeType,
      startTime,
      endTime,
      dates,
      days,
      value,
    } = coupon;
    const entity = await CouponApi.updateCoupon({
      id,
      name,
      minimum_order_value: minimumOrderValue,
      type,
      value,
      validity_time_type: validityTimeType,
      start_time: startTime,
      end_time: endTime,
      dates,
      days,
    });
    storeManager.emitUpdate(STORE_NAME.COUPON, {
      entities: [entity],
    });
  }
}
