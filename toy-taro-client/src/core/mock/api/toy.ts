import { MOCK_API_NAME } from '../constants';

export const mockToyApi = {
  [MOCK_API_NAME.GET_TOY_LIST]: () => {
    return [{ id: '123' }];
  },
};
