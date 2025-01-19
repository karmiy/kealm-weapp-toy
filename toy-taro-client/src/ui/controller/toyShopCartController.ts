import { computed, makeObserver, observable, reaction } from '@shared/utils/observer';
import { Singleton } from '@shared/utils/utils';
import { sdk, STORE_NAME } from '@core';

export class ToyShopCartController extends Singleton {
  static identifier = 'ToyShopCartController';

  private _disposers: Array<() => void> = [];

  constructor() {
    super();
    makeObserver(this);
  }

  @observable
  allIds: Array<string> = [];

  @observable
  allProductIds: Array<string> = [];

  @observable
  checkIds: Array<string> = [];

  @observable
  totalScore = 0;

  @computed
  get isCheckedAll() {
    return Boolean(this.checkIds.length && this.checkIds.length === this.allIds.length);
  }

  private _handleToyShopCartChange = () => {
    const allIds: string[] = [];
    const allProductIds: string[] = [];
    sdk.storeManager.get(STORE_NAME.TOY_SHOP_CART).forEach(shopCart => {
      allIds.push(shopCart.id);
      allProductIds.push(shopCart.productId);
    });
    this.allIds = allIds;
    this.allProductIds = allProductIds;
    this.checkIds = this.checkIds.filter(id => this.allIds.includes(id));
    this._calcTotalScore();
  };

  private _calcTotalScore = () => {
    this.totalScore = this.checkIds.reduce((sum, id) => {
      const shopCart = sdk.storeManager.getById(STORE_NAME.TOY_SHOP_CART, id);
      if (!shopCart) return sum;

      const toy = sdk.storeManager.getById(STORE_NAME.TOY, shopCart.productId);
      if (!toy) return sum;

      return sum + (toy.score * shopCart.quantity ?? 0);
    }, 0);
  };

  init() {
    this._handleToyShopCartChange();
    sdk.storeManager.subscribe(STORE_NAME.TOY_SHOP_CART, this._handleToyShopCartChange);

    const disposer = reaction(() => this.checkIds, this._calcTotalScore);
    this._disposers.push(disposer);
  }

  dispose() {
    sdk.storeManager.unsubscribe(STORE_NAME.TOY_SHOP_CART, this._handleToyShopCartChange);
    this._disposers.forEach(disposer => disposer());
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
