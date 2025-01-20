import { CouponApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

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
}
