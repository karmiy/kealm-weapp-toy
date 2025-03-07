import { LuckyDrawEntity } from '../entity';
import { httpRequest } from '../httpRequest';
import { mock, MOCK_API_NAME } from '../mock';

export type LuckyDrawApiUpdateParams = Pick<
  LuckyDrawEntity,
  'name' | 'type' | 'cover_image' | 'list' | 'quantity'
> & {
  id?: string;
};

export class LuckyDrawApi {
  @mock({ name: MOCK_API_NAME.GET_LUCKY_DRAW_LIST })
  static async getLuckyDrawList(): Promise<LuckyDrawEntity[]> {
    return httpRequest.get<LuckyDrawEntity[]>({
      url: '/luckyDraw/getLuckyDrawList',
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_LUCKY_DRAW })
  static async updateLuckyDraw(luckyDraw: LuckyDrawApiUpdateParams): Promise<LuckyDrawEntity> {
    return httpRequest.postFormDataFile<LuckyDrawEntity>({
      url: '/luckyDraw/updateLuckyDraw',
      data: luckyDraw,
      filePath: luckyDraw.cover_image,
    });
  }

  @mock({ name: MOCK_API_NAME.DELETE_LUCKY_DRAW })
  static async deleteLuckyDraw(id: string): Promise<void> {
    return httpRequest.post<void>({
      url: '/luckyDraw/deleteLuckyDraw',
      data: { id },
    });
  }

  @mock({ name: MOCK_API_NAME.START_LUCKY_DRAW })
  static async startLuckyDraw(id: string): Promise<{ prize_id: string; index: number }> {
    return httpRequest.post<{ prize_id: string; index: number }>({
      url: '/luckyDraw/startLuckyDraw',
      data: { id },
    });
  }
}
