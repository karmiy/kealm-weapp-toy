import { OrderEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class OrderApi {
  @mock({ name: MOCK_API_NAME.GET_ORDER_LIST, enable: true })
  static async getOrderList(): Promise<OrderEntity[]> {
    return Promise.resolve([]);
  }
}
