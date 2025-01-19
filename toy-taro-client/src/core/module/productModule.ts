import { ProductApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class ProductModule extends AbstractModule {
  protected onLoad() {
    this.syncProductList();
    this.syncProductCategoryList();
    this.syncProductShopCartList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.PRODUCT;
  }

  async syncProductList() {
    storeManager.startLoading(STORE_NAME.PRODUCT);
    const productList = await ProductApi.getProductList();
    storeManager.refresh(STORE_NAME.PRODUCT, productList);
    storeManager.stopLoading(STORE_NAME.PRODUCT);
  }

  async syncProductCategoryList() {
    storeManager.startLoading(STORE_NAME.PRODUCT_CATEGORY);
    const productCategoryLList = await ProductApi.getProductCategoryList();
    storeManager.refresh(STORE_NAME.PRODUCT_CATEGORY, productCategoryLList);
    storeManager.stopLoading(STORE_NAME.PRODUCT_CATEGORY);
  }

  async syncProductShopCartList() {
    storeManager.startLoading(STORE_NAME.PRODUCT_SHOP_CART);
    const productShopCartList = await ProductApi.getProductShopCart();
    storeManager.refresh(STORE_NAME.PRODUCT_SHOP_CART, productShopCartList);
    storeManager.stopLoading(STORE_NAME.PRODUCT_SHOP_CART);
  }

  async updateProductShopCart(id: string, quantity: number) {
    try {
      await ProductApi.updateProductShopCart(id, quantity);
      if (quantity > 0) {
        storeManager.emitUpdate(STORE_NAME.PRODUCT_SHOP_CART, {
          partials: [
            {
              id,
              quantity,
            },
          ],
        });
        return;
      }
      storeManager.emitDelete(STORE_NAME.PRODUCT_SHOP_CART, [id]);
    } catch (error) {
      this._logger.error('updateProductShopCart error', error);
      throw error;
    }
  }

  async addProductShopCart(productId: string, quantity: number) {
    try {
      await ProductApi.updateProductShopCart(productId, quantity);
      const now = new Date().getTime();
      storeManager.emitUpdate(STORE_NAME.PRODUCT_SHOP_CART, {
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
      this._logger.error('addProductShopCart error', error);
      throw error;
    }
  }
}
