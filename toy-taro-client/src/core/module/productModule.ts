import { ProductApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';
import { ProductUpdateParams } from '../types';

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
      this._logger.error('updateProductShopCart error', error.message);
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
      this._logger.error('addProductShopCart error', error.message);
      throw error;
    }
  }

  async updateProduct(params: ProductUpdateParams) {
    try {
      const {
        id,
        name,
        desc,
        discountedScore,
        originalScore,
        stock,
        coverImage,
        categoryId,
        flashSaleStart,
        flashSaleEnd,
      } = params;
      this._logger.info('updateProduct', params);
      const entity = await ProductApi.updateProduct({
        id,
        name,
        desc,
        discounted_score: discountedScore,
        original_score: originalScore,
        stock,
        cover_image: coverImage,
        category_id: categoryId,
        flash_sale_start: flashSaleStart,
        flash_sale_end: flashSaleEnd,
      });
      storeManager.emitUpdate(STORE_NAME.PRODUCT, {
        entities: [entity],
      });
    } catch (error) {
      this._logger.info('updateProduct error', error.message);
      throw error;
    }
  }

  async updateProductCategory(productCategory: { id?: string; name: string }) {
    try {
      this._logger.info('updateProductCategory', productCategory);
      const entity = await ProductApi.updateProductCategory(productCategory);
      storeManager.emitUpdate(STORE_NAME.PRODUCT_CATEGORY, {
        entities: [entity],
      });
    } catch (error) {
      this._logger.info('updateProductCategory error', error.message);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      this._logger.info('deleteProduct', id);
      await ProductApi.deleteProduct(id);
      storeManager.emitDelete(STORE_NAME.PRODUCT, [id]);
    } catch (error) {
      this._logger.info('deleteProduct error', error.message);
      throw error;
    }
  }

  async deleteProductCategory(id: string) {
    try {
      this._logger.info('deleteProductCategory', id);
      await ProductApi.deleteProductCategory(id);
      storeManager.emitDelete(STORE_NAME.PRODUCT_CATEGORY, [id]);
    } catch (error) {
      this._logger.info('deleteProductCategory error', error.message);
      throw error;
    }
  }
}
