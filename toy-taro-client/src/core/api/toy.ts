import { ToyEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class ToyApi {
  @mock({ name: MOCK_API_NAME.GET_TOY_LIST, enable: true })
  static async getToyList(): Promise<ToyEntity[]> {
    return Promise.resolve([]);
  }
}
