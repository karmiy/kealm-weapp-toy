import { sleep } from '@shared/utils/utils';
import { OrderEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class OrderApi {
  @mock({ name: MOCK_API_NAME.GET_ORDER_LIST, enable: true })
  static async getOrderList(): Promise<OrderEntity[]> {
    return Promise.resolve([]);
  }

  static async revokeOrder(id: string): Promise<void> {
    await sleep(1000);
    return Math.random() > 0.6 ? Promise.resolve() : Promise.reject();
  }
}
