import { ToyCategoryEntity, ToyEntity, ToyShopCartEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class ToyApi {
  @mock({ name: MOCK_API_NAME.GET_TOY_LIST, enable: true })
  static async getToyList(): Promise<ToyEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_TOY_CATEGORY_LIST, enable: true })
  static async getToyCategoryList(): Promise<ToyCategoryEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_TOY_SHOP_CART, enable: true })
  static async getToyShopCart(): Promise<ToyShopCartEntity[]> {
    return Promise.resolve([]);
  }

  static async updateToyShopCart(id: string, quantity: number): Promise<void> {
    return Promise.resolve();
  }
}
