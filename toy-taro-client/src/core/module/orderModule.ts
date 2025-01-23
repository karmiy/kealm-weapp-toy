import { OrderApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, ORDER_STATUS, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class OrderModule extends AbstractModule {
  protected onLoad() {}
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

  async revokeOrder(id: string) {
    try {
      this._logger.info('revokeOrder', id);
      await OrderApi.revokeOrder(id);
      storeManager.emitUpdate(STORE_NAME.ORDER, {
        partials: [
          {
            id,
            status: ORDER_STATUS.Revoking,
          },
        ],
      });
    } catch (error) {
      this._logger.error('revokeOrder error', error);
      throw error;
    }
  }
}
