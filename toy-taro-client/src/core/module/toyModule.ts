import { ToyApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class ToyModule extends AbstractModule {
  protected onLoad() {
    this.syncToyList();
    this.syncToyCategoryList();
    this.syncToyShopCartList();
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

  async syncToyShopCartList() {
    storeManager.startLoading(STORE_NAME.TOY_SHOP_CART);
    const toyShopCartList = await ToyApi.getToyShopCart();
    storeManager.refresh(STORE_NAME.TOY_SHOP_CART, toyShopCartList);
    storeManager.stopLoading(STORE_NAME.TOY_SHOP_CART);
  }

  async updateToyShopCart(id: string, quantity: number) {
    try {
      await ToyApi.updateToyShopCart(id, quantity);
      if (quantity > 0) {
        storeManager.emitUpdate(STORE_NAME.TOY_SHOP_CART, {
          partials: [
            {
              id,
              quantity,
            },
          ],
        });
        return;
      }
      storeManager.emitDelete(STORE_NAME.TOY_SHOP_CART, [id]);
    } catch (error) {
      this._logger.error('updateToyShopCart error', error);
      throw error;
    }
  }

  async addToyShopCart(productId: string, quantity: number) {
    try {
      await ToyApi.updateToyShopCart(productId, quantity);
      const now = new Date().getTime();
      storeManager.emitUpdate(STORE_NAME.TOY_SHOP_CART, {
        entities: [
          {
            id: `${now}-${productId}`,
            product_id: productId,
            user_id: 'user_id',
            create_time: now,
            last_modified_time: now,
            quantity,
          },
        ],
      });
    } catch (error) {
      this._logger.error('addToyShopCart error', error);
      throw error;
    }
  }
}
