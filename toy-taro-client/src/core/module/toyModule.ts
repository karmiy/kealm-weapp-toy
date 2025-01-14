import { ToyApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class ToyModule extends AbstractModule {
  protected onLoad() {
    this.syncToyList();
    this.syncToyCategoryList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.TOY;
  }

  async syncToyList() {
    storeManager.startLoading(STORE_NAME.TOY);
    const toyList = await ToyApi.getToyList();
    storeManager.refresh(STORE_NAME.TOY, toyList);
    storeManager.stopLoading(STORE_NAME.TOY);
  }

  async syncToyCategoryList() {
    storeManager.startLoading(STORE_NAME.TOY_CATEGORY);
    const toyCategoryLList = await ToyApi.getToyCategoryList();
    storeManager.refresh(STORE_NAME.TOY_CATEGORY, toyCategoryLList);
    storeManager.stopLoading(STORE_NAME.TOY_CATEGORY);
  }
}
