import { DISCIPLINE_TYPE } from '../constants';
import { httpRequest } from '../httpRequest';
import { mock, MOCK_API_NAME } from '../mock';

/**
 * 奖惩记录创建参数
 */
export interface DisciplineApiCreateParams {
  userId: string;
  type: DISCIPLINE_TYPE;
  prizeId: string;
  reason: string;
}

/**
 * 奖惩记录 API
 */
export class DisciplineApi {
  /**
   * 创建奖惩记录
   * @param params 创建参数
   * @returns 创建的奖惩记录
   */
  @mock({ name: MOCK_API_NAME.CREATE_DISCIPLINE })
  static async createDiscipline(params: DisciplineApiCreateParams) {
    return httpRequest.post<{ id: string }>({
      url: '/discipline/createDiscipline',
      data: params,
    });
  }
}
