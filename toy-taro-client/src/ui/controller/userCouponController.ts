import { makeObserver, observable } from '@shared/utils/observer';
import { Singleton } from '@shared/utils/utils';
import { COUPON_STATUS, sdk, STORE_NAME } from '@core';

export class UserCouponController extends Singleton {
  static identifier = 'UserCouponController';

  private _disposers: Array<() => void> = [];

  @observable
  allCouponIds: Array<string> = [];
  @observable
  activeCouponIds: Array<string> = [];

  @observable
  usedCouponIds: Array<string> = [];

  @observable
  expiredCouponIds: Array<string> = [];

  constructor() {
    super();
    makeObserver(this);
  }

  private _handleCouponListChange = () => {
    const storeManager = sdk.storeManager;
    const ids = storeManager.getSortIds(STORE_NAME.USER_COUPON);
    const activeCouponIds: string[] = [];
    const usedCouponIds: string[] = [];
    const expiredCouponIds: string[] = [];
    ids.forEach(id => {
      const userCoupon = storeManager.getById(STORE_NAME.USER_COUPON, id);
      if (!userCoupon) return;
      const coupon = storeManager.getById(STORE_NAME.COUPON, userCoupon.couponId);
      if (!coupon) return;

      switch (userCoupon.status) {
        case COUPON_STATUS.ACTIVE:
          coupon.isExpired ? expiredCouponIds.push(id) : activeCouponIds.push(id);
          break;
        case COUPON_STATUS.USED:
          usedCouponIds.push(id);
          break;
      }
    });
    this.allCouponIds = ids;
    this.activeCouponIds = activeCouponIds;
    this.usedCouponIds = usedCouponIds;
    this.expiredCouponIds = expiredCouponIds;
  };

  init() {
    this._handleCouponListChange();
    sdk.storeManager.subscribe(STORE_NAME.COUPON, this._handleCouponListChange);
    sdk.storeManager.subscribe(STORE_NAME.USER_COUPON, this._handleCouponListChange);
  }

  dispose() {
    super.dispose();
    sdk.storeManager.unsubscribe(STORE_NAME.COUPON, this._handleCouponListChange);
    sdk.storeManager.unsubscribe(STORE_NAME.USER_COUPON, this._handleCouponListChange);
    this.activeCouponIds.length = 0;
    this.usedCouponIds.length = 0;
    this.expiredCouponIds.length = 0;
    this._disposers.forEach(disposer => disposer());
    this._disposers.length = 0;
  }
}
