import { ORDER_STATUS } from '../constants';
import { OrderEntity } from '../entity';
import { httpRequest } from '../httpRequest';
import { mock, MOCK_API_NAME } from '../mock';

export class OrderApi {
  @mock({ name: MOCK_API_NAME.GET_ORDER_LIST })
  static async getOrderList(): Promise<OrderEntity[]> {
    return httpRequest.get<OrderEntity[]>({
      url: '/order/getProductOrderList',
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_ORDER_STATUS })
  static async updateOrderStatus(id: string, status: ORDER_STATUS): Promise<void> {
    return httpRequest.post<void>({
      url: '/order/updateProductOrderStatus',
      data: {
        id,
        status,
      },
    });
  }

  @mock({ name: MOCK_API_NAME.CREATE_ORDER })
  static async createOrder(params: { coupon_id?: string; shop_cart_ids: string[] }): Promise<void> {
    return httpRequest.post<void>({
      url: '/order/createProductOrder',
      data: params,
    });
  }
}
