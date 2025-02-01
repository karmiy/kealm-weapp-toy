import { Singleton } from '@shared/utils/utils';
import { sdk, STORE_NAME } from '@core';

type Listener = () => void;

export class ProductLimitedTimeOfferController extends Singleton {
  static identifier = 'ProductLimitedTimeOfferController';

  private _listeners = new Set<Listener>();
  ids: string[] = [];

  private _getLimitedTimeOfferIds = () => {
    return sdk.storeManager.getSortIds(STORE_NAME.PRODUCT).filter(id => {
      const model = sdk.storeManager.getById(STORE_NAME.PRODUCT, id);
      return model?.isLimitedTimeOffer;
    });
  };

  private _handleProductChange = () => {
    const ids = this._getLimitedTimeOfferIds();
    this.ids = ids;
    this._listeners.forEach(listener => listener());
  };

  init() {
    this._handleProductChange();
    sdk.storeManager.subscribe(STORE_NAME.PRODUCT, this._handleProductChange);
  }

  dispose() {
    super.dispose();
    sdk.storeManager.unsubscribe(STORE_NAME.PRODUCT, this._handleProductChange);
    this._listeners.clear();
    this.ids.length = 0;
  }

  on(listener: Listener) {
    this._listeners.add(listener);
  }

  off(listener: Listener) {
    this._listeners.delete(listener);
  }
}
