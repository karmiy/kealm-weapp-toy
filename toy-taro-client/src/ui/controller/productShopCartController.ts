import { computed, makeObserver, observable, reaction } from '@shared/utils/observer';
import { Singleton } from '@shared/utils/utils';
import { sdk, STORE_NAME } from '@core';

export class ProductShopCartController extends Singleton {
  static identifier = 'ProductShopCartController';

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

  private _handleProductShopCartChange = () => {
    const allIds: string[] = [];
    const allProductIds: string[] = [];
    sdk.storeManager.get(STORE_NAME.PRODUCT_SHOP_CART).forEach(shopCart => {
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
      const shopCart = sdk.storeManager.getById(STORE_NAME.PRODUCT_SHOP_CART, id);
      if (!shopCart) return sum;

      const product = sdk.storeManager.getById(STORE_NAME.PRODUCT, shopCart.productId);
      if (!product) return sum;

      return sum + (product.score * shopCart.quantity ?? 0);
    }, 0);
  };

  init() {
    this._handleProductShopCartChange();
    sdk.storeManager.subscribe(STORE_NAME.PRODUCT_SHOP_CART, this._handleProductShopCartChange);

    const disposer = reaction(() => this.checkIds, this._calcTotalScore);
    this._disposers.push(disposer);
  }

  dispose() {
    sdk.storeManager.unsubscribe(STORE_NAME.PRODUCT_SHOP_CART, this._handleProductShopCartChange);
    this.allIds.length = 0;
    this.allProductIds.length = 0;
    this.checkIds.length = 0;
    this.totalScore = 0;
    this._disposers.forEach(disposer => disposer());
    this.allIds.length = 0;
  }

  toggleCheckStatus(id: string) {
    if (this.checkIds.includes(id)) {
      this.checkIds = this.checkIds.filter(item => item !== id);
    } else {
      this.checkIds = [...this.checkIds, id];
    }
  }

  checkAll() {
    this.checkIds = [...sdk.storeManager.getIds(STORE_NAME.PRODUCT_SHOP_CART)];
  }

  uncheckAll() {
    this.checkIds = [];
  }
}
