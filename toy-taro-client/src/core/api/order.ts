import { sleep } from '@shared/utils/utils';
import { ORDER_STATUS } from '../constants';
import { OrderEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class OrderApi {
  @mock({ name: MOCK_API_NAME.GET_ORDER_LIST })
  static async getOrderList(): Promise<OrderEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.UPDATE_ORDER_STATUS })
  static async updateOrderStatus(id: string, status: ORDER_STATUS): Promise<void> {
    return Promise.resolve();
  }
}
