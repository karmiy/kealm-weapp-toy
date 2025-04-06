import { CouponApi } from '../api';
import { AbstractModule, UserStorageManager } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';
import { CouponUpdateParams } from '../types';

export class CouponModule extends AbstractModule {
  protected onLoad() {
    this.syncCouponList();
    this.syncUserCouponList();
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

  async syncUserCouponList() {
    storeManager.startLoading(STORE_NAME.USER_COUPON);
    const isAdmin = UserStorageManager.getInstance().isAdmin;
    const userCouponList = !isAdmin
      ? await CouponApi.getUserCouponList()
      : await CouponApi.getGroupUserCouponList();
    storeManager.refresh(STORE_NAME.USER_COUPON, userCouponList);
    storeManager.stopLoading(STORE_NAME.USER_COUPON);
  }

  async deleteCoupon(id: string) {
    try {
      this._logger.info('deleteCoupon', id);
      await CouponApi.deleteCoupon(id);
      storeManager.emitDelete(STORE_NAME.COUPON, [id]);
    } catch (error) {
      this._logger.info('deleteCoupon error', error.message);
      throw error;
    }
  }

  async updateCoupon(coupon: CouponUpdateParams) {
    try {
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
      this._logger.info('updateCoupon', coupon);
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
    } catch (error) {
      this._logger.info('updateCoupon error', error.message);
      throw error;
    }
  }
}
