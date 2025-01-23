import { OrderApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class OrderModule extends AbstractModule {
  protected onLoad() {
    this.syncOrderList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.ORDER;
  }

  async syncOrderList() {
    storeManager.startLoading(STORE_NAME.ORDER);
    const couponList = await OrderApi.getOrderList();
    storeManager.refresh(STORE_NAME.ORDER, couponList);
    storeManager.stopLoading(STORE_NAME.ORDER);
  }
}
