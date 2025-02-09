import { ProductCategoryEntity, ProductEntity, ProductShopCartEntity } from '../entity';
import { httpRequest } from '../httpRequest';
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
    return httpRequest.get<ProductEntity[]>({
      url: '/product/getProductList',
    });
  }

  @mock({ name: MOCK_API_NAME.GET_PRODUCT_CATEGORY_LIST })
  static async getProductCategoryList(): Promise<ProductCategoryEntity[]> {
    return httpRequest.get<ProductCategoryEntity[]>({
      url: '/product/getProductCategoryList',
    });
  }

  @mock({ name: MOCK_API_NAME.GET_PRODUCT_SHOP_CART })
  static async getProductShopCart(): Promise<ProductShopCartEntity[]> {
    return httpRequest.get<ProductShopCartEntity[]>({
      url: '/product/getProductShopCartList',
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_PRODUCT_SHOP_CART })
  static async updateProductShopCart(params: {
    id?: string;
    quantity: number;
    product_id?: string;
  }): Promise<ProductShopCartEntity> {
    return httpRequest.post<ProductShopCartEntity>({
      url: '/product/updateProductShopCart',
      data: params,
    });
  }

  @mock({ name: MOCK_API_NAME.DELETE_PRODUCT_SHOP_CART })
  static async deleteProductShopCart(params: { id: string }): Promise<void> {
    return httpRequest.post<void>({
      url: '/product/deleteProductShopCart',
      data: params,
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_PRODUCT })
  static async updateProduct(params: ProductApiUpdateParams): Promise<ProductEntity> {
    return httpRequest.postFormDataFile<ProductEntity>({
      url: '/product/updateProduct',
      data: params,
      filePath: params.cover_image,
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_PRODUCT_CATEGORY })
  static async updateProductCategory(params: {
    id?: string;
    name: string;
  }): Promise<ProductCategoryEntity> {
    return httpRequest.post<ProductCategoryEntity>({
      url: '/product/updateProductCategory',
      data: params,
    });
  }

  @mock({ name: MOCK_API_NAME.DELETE_PRODUCT })
  static async deleteProduct(id: string): Promise<void> {
    return httpRequest.post<void>({
      url: '/product/deleteProduct',
      data: {
        id,
      },
    });
  }

  @mock({ name: MOCK_API_NAME.DELETE_PRODUCT_CATEGORY })
  static async deleteProductCategory(id: string): Promise<void> {
    return httpRequest.post<void>({
      url: '/product/deleteProductCategory',
      data: {
        id,
      },
    });
  }
}
