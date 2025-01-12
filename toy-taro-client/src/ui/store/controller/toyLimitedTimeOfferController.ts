import { sdk, STORE_NAME } from '@core';
import { Singleton } from '@shared/utils/utils';

class ToyLimitedTimeOfferController extends Singleton<ToyLimitedTimeOfferController> {
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
  };

  init() {
    sdk.storeManager.subscribeIdList(STORE_NAME.TOY, this._handleIdsChange);
  }

  dispose() {
    sdk.storeManager.unsubscribeIdList(STORE_NAME.TOY, this._handleIdsChange);
  }
}
