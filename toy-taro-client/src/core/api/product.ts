import { ProductCategoryEntity, ProductEntity, ProductShopCartEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class ProductApi {
  @mock({ name: MOCK_API_NAME.GET_PRODUCT_LIST, enable: true })
  static async getProductList(): Promise<ProductEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_PRODUCT_CATEGORY_LIST, enable: true })
  static async getProductCategoryList(): Promise<ProductCategoryEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_PRODUCT_SHOP_CART, enable: true })
  static async getProductShopCart(): Promise<ProductShopCartEntity[]> {
    return Promise.resolve([]);
  }

  static async updateProductShopCart(id: string, quantity: number): Promise<void> {
    return Math.random() > 0.5 ? Promise.resolve() : Promise.reject();
  }
}
