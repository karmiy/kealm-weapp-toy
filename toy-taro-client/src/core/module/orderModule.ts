import { eventCenter } from '@tarojs/taro';
import { OrderApi } from '../api';
import { AbstractModule } from '../base';
import { COUPON_STATUS, EVENT_KEYS, MODULE_NAME, ORDER_STATUS, STORE_NAME } from '../constants';
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

  async createOrder(params: { couponId?: string; shopCartIds: string[] }) {
    try {
      const { couponId, shopCartIds } = params;
      await OrderApi.createOrder({
        coupon_id: couponId,
        shop_cart_ids: shopCartIds,
      });
      storeManager.emitDelete(STORE_NAME.PRODUCT_SHOP_CART, shopCartIds);
      couponId &&
        storeManager.emitUpdate(STORE_NAME.USER_COUPON, {
          partials: [
            {
              id: couponId,
              status: COUPON_STATUS.USED,
            },
          ],
        });
      this._syncOrderAssociatedData();
    } catch (error) {
      this._logger.error('createOrder error', error.message);
      throw error;
    }
  }

  private _syncOrderAssociatedData() {
    eventCenter.trigger(EVENT_KEYS.product.SYNC_PRODUCT_LIST);
    eventCenter.trigger(EVENT_KEYS.user.SYNC_USER_INFO);
  }
}
