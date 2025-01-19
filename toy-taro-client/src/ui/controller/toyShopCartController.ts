import { computed, makeObserver, observable } from '@shared/utils/observer';
import { Singleton } from '@shared/utils/utils';
import { sdk, STORE_NAME } from '@core';

export class ToyShopCartController extends Singleton {
  static identifier = 'ToyShopCartController';

  constructor() {
    super();
    makeObserver(this);
  }

  @observable
  private _allIds: Array<string> = [];

  @observable
  checkIds: Array<string> = [];
  // private _checkIdsListeners = new Set<Listener>();
  @observable
  totalScore = 0;

  @computed
  get isCheckedAll() {
    return Boolean(this.checkIds.length && this.checkIds.length === this._allIds.length);
  }

  private _handleToyShopCartChange = () => {
    this._allIds = [...sdk.storeManager.getIds(STORE_NAME.TOY_SHOP_CART)];
  };

  init() {
    this._handleToyShopCartChange();
    sdk.storeManager.subscribe(STORE_NAME.TOY_SHOP_CART, this._handleToyShopCartChange);
  }

  dispose() {
    sdk.storeManager.unsubscribe(STORE_NAME.TOY_SHOP_CART, this._handleToyShopCartChange);
  }

  toggleCheckStatus(id: string) {
    if (this.checkIds.includes(id)) {
      this.checkIds = this.checkIds.filter(item => item !== id);
    } else {
      this.checkIds = [...this.checkIds, id];
    }
  }

  checkAll() {
    this.checkIds = [...sdk.storeManager.getIds(STORE_NAME.TOY_SHOP_CART)];
  }

  uncheckAll() {
    this.checkIds = [];
  }
}
