import { ProductCategoryEntity, ProductEntity, ProductShopCartEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export type ProductApiUpdateParams = Pick<
  ProductEntity,
  'name' | 'desc' | 'discounted_score' | 'original_score' | 'stock' | 'cover_image' | 'category_id'
> & {
  id?: string;
  flash_sale_start?: string;
  flash_sale_end?: string;
};

export class ProductApi {
  @mock({ name: MOCK_API_NAME.GET_PRODUCT_LIST })
  static async getProductList(): Promise<ProductEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_PRODUCT_CATEGORY_LIST })
  static async getProductCategoryList(): Promise<ProductCategoryEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_PRODUCT_SHOP_CART })
  static async getProductShopCart(): Promise<ProductShopCartEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.UPDATE_PRODUCT_SHOP_CART })
  static async updateProductShopCart(id: string, quantity: number): Promise<void> {
    return Math.random() > 0.5 ? Promise.resolve() : Promise.reject();
  }

  @mock({ name: MOCK_API_NAME.UPDATE_PRODUCT })
  static async updateProduct(params: ProductApiUpdateParams): Promise<ProductEntity> {
    return Promise.resolve({} as ProductEntity);
  }

  @mock({ name: MOCK_API_NAME.UPDATE_PRODUCT_CATEGORY })
  static async updateProductCategory(params: {
    id?: string;
    name: string;
  }): Promise<ProductCategoryEntity> {
    return Promise.resolve({} as ProductCategoryEntity);
  }

  @mock({ name: MOCK_API_NAME.DELETE_PRODUCT })
  static async deleteProduct(id: string): Promise<void> {
    return Promise.resolve();
  }

  @mock({ name: MOCK_API_NAME.DELETE_PRODUCT_CATEGORY })
  static async deleteProductCategory(id: string): Promise<void> {
    return Promise.resolve();
  }
}
