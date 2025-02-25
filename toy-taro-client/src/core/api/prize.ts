import { PRIZE_TYPE } from '../constants';
import { PrizeEntity } from '../entity';
import { httpRequest } from '../httpRequest';
import { mock, MOCK_API_NAME } from '../mock';

export type PrizeApiUpdateParams = {
  id?: string;
  type: PRIZE_TYPE;
  coupon_id?: string;
  points?: number;
};

export class PrizeApi {
  @mock({ name: MOCK_API_NAME.GET_PRIZE_LIST })
  static async getPrizeList(): Promise<PrizeEntity[]> {
    return httpRequest.get<PrizeEntity[]>({
      url: '/prize/getPrizeList',
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_PRIZE })
  static async updatePrize(prize: PrizeApiUpdateParams): Promise<PrizeEntity> {
    return httpRequest.post<PrizeEntity>({
      url: '/prize/updatePrize',
      data: prize,
    });
  }

  @mock({ name: MOCK_API_NAME.DELETE_PRIZE })
  static async deletePrize(id: string): Promise<void> {
    return httpRequest.post<void>({
      url: '/prize/deletePrize',
      data: { id },
    });
  }
}
