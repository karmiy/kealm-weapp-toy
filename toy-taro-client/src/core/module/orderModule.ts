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

  async updateOrderStatus(id: string, status: ORDER_STATUS) {
    try {
      this._logger.info('updateOrderStatus', id, status);
      await OrderApi.updateOrderStatus(id, status);
      storeManager.emitUpdate(STORE_NAME.ORDER, {
        partials: [
          {
            id,
            status,
            last_modified_time: new Date().getTime(),
          },
        ],
      });
    } catch (error) {
      this._logger.error('updateOrderStatus error', error.message);
      throw error;
    }
  }
}
