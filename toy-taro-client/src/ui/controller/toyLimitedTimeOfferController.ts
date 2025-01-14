import { Singleton } from '@shared/utils/utils';
import { sdk, STORE_NAME } from '@core';

type Listener = () => void;

export class ToyLimitedTimeOfferController extends Singleton {
  static identifier = 'ToyLimitedTimeOfferController';

  private _listeners = new Set<Listener>();
  ids: string[] = [];

  private _getLimitedTimeOfferIds = () => {
    return sdk.storeManager.getSortIds(STORE_NAME.TOY).filter(id => {
      const model = sdk.storeManager.getById(STORE_NAME.TOY, id);
      return model?.isLimitedTimeOffer;
    });
  };

  private _handleIdsChange = () => {
    const ids = this._getLimitedTimeOfferIds();
    this.ids = ids;
    this._listeners.forEach(listener => listener());
  };

  init() {
    this._handleIdsChange();
    sdk.storeManager.subscribeIdList(STORE_NAME.TOY, this._handleIdsChange);
  }

  dispose() {
    sdk.storeManager.unsubscribeIdList(STORE_NAME.TOY, this._handleIdsChange);
    this._listeners.clear();
  }

  on(listener: Listener) {
    this._listeners.add(listener);
  }

  off(listener: Listener) {
    this._listeners.delete(listener);
  }
}
