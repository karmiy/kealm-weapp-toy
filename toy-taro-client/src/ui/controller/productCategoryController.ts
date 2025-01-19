import isEqual from 'lodash/isEqual';
import { Singleton } from '@shared/utils/utils';
import { sdk, STORE_NAME } from '@core';

type Listener = () => void;

export class ProductCategoryController extends Singleton {
  static identifier = 'ProductCategoryController';

  private _productIdsListeners = new Map<string, Set<Listener>>();
  private _productIdsStore = new Map<string, Set<string>>();

  init() {
    this._handleProductListChange();
    sdk.storeManager.subscribeIdList(STORE_NAME.PRODUCT, this._handleProductListChange);
  }

  dispose() {
    sdk.storeManager.unsubscribeIdList(STORE_NAME.PRODUCT, this._handleProductListChange);
    this._productIdsListeners.clear();
    this._productIdsStore.clear();
  }

  private _handleProductListChange = () => {
    const storeManager = sdk.storeManager;
    const allProductIds = storeManager.getSortIds(STORE_NAME.PRODUCT);
    const store = new Map<string, Set<string>>();
    allProductIds.forEach(id => {
      const productModel = storeManager.getById(STORE_NAME.PRODUCT, id);
      if (!productModel) {
        return;
      }
      const { categoryId } = productModel;
      const productIds = store.get(categoryId) ?? new Set();
      productIds.add(id);
      store.set(categoryId, productIds);
    });
    const prevStore = this._productIdsStore;
    this._productIdsStore = store;

    [...store.entries()].forEach(([categoryId, ids]) => {
      const prevIds = prevStore.get(categoryId);
      if (prevIds && isEqual(prevIds, ids)) {
        return;
      }
      this._notifyChange(categoryId);
    });
  };

  private _notifyChange = (categoryId: string) => {
    const listeners = this._productIdsListeners.get(categoryId);
    listeners?.forEach(listener => listener());
  };

  getProductIds(categoryId: string) {
    const productIds = this._productIdsStore.get(categoryId);
    return productIds ? Array.from(productIds) : [];
  }

  onProductListChange(categoryId: string, listener: Listener) {
    const listeners = this._productIdsListeners.get(categoryId) ?? new Set();
    listeners.add(listener);
    this._productIdsListeners.set(categoryId, listeners);
  }

  offProductListChange(categoryId: string, listener: Listener) {
    const listeners = this._productIdsListeners.get(categoryId);
    listeners?.delete(listener);
    !listeners?.size && this._productIdsListeners.delete(categoryId);
  }
}
