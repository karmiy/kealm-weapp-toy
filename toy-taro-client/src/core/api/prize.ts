import { PrizeEntity } from '../entity';
import { httpRequest } from '../httpRequest';
import { mock, MOCK_API_NAME } from '../mock';

export class PrizeApi {
  @mock({ name: MOCK_API_NAME.GET_PRIZE_LIST })
  static async getPrizeList(): Promise<PrizeEntity[]> {
    return httpRequest.get<PrizeEntity[]>({
      url: '/prize/getPrizeList',
    });
  }
}
