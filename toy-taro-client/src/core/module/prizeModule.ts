import { PrizeApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class PrizeModule extends AbstractModule {
  protected onLoad() {
    this.syncPrizeList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.PRIZE;
  }

  async syncPrizeList() {
    storeManager.startLoading(STORE_NAME.PRIZE);
    const prizeList = await PrizeApi.getPrizeList();
    storeManager.refresh(STORE_NAME.PRIZE, prizeList);
    storeManager.stopLoading(STORE_NAME.PRIZE);
  }
}
