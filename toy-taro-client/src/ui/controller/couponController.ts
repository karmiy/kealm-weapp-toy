import { makeObserver, observable } from '@shared/utils/observer';
import { Singleton } from '@shared/utils/utils';
import { COUPON_STATUS, sdk, STORE_NAME } from '@core';

export class CouponController extends Singleton {
  static identifier = 'CouponController';

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
    const ids = sdk.storeManager.getSortIds(STORE_NAME.COUPON);
    const activeCouponIds: string[] = [];
    const usedCouponIds: string[] = [];
    const expiredCouponIds: string[] = [];
    ids.forEach(id => {
      const coupon = sdk.storeManager.getById(STORE_NAME.COUPON, id);
      if (!coupon) return;

      switch (coupon.status) {
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
  }

  dispose() {
    sdk.storeManager.unsubscribe(STORE_NAME.COUPON, this._handleCouponListChange);
    this.activeCouponIds.length = 0;
    this.usedCouponIds.length = 0;
    this.expiredCouponIds.length = 0;
    this._disposers.forEach(disposer => disposer());
    this._disposers.length = 0;
  }
}
