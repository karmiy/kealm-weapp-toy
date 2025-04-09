import { faker } from '@faker-js/faker';
import { JsError, sleep } from '@shared/utils/utils';
import { DisciplineApiCreateParams } from '../../api';
import { SERVER_ERROR_CODE } from '../../constants';
import { MOCK_API_NAME } from '../constants';

export const mockDisciplineApi = {
  [MOCK_API_NAME.CREATE_DISCIPLINE]: async (
    params: DisciplineApiCreateParams,
  ): Promise<{ id: string }> => {
    await sleep(500);
    const throwError = Math.random() <= 0.4;
    if (throwError) {
      return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '创建失败，请联系管理员'));
    }
    return {
      id: faker.string.ulid(),
    };
  },
};
