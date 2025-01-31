import { faker } from '@faker-js/faker';
import { JsError, sleep } from '@shared/utils/utils';
import { UserStorageManager } from '../../base';
import { ORDER_STATUS, SERVER_ERROR_CODE } from '../../constants';
import { OrderEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';

export const mockOrderApi = {
  [MOCK_API_NAME.GET_ORDER_LIST]: async (): Promise<OrderEntity[]> => {
    await sleep(1000);
    return faker.helpers.multiple(
      () => {
        const isAdmin = UserStorageManager.getInstance().isAdmin;
        return {
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          desc: faker.commerce.productDescription(),
          score: faker.number.int({ min: 1, max: 100 }),
          count: faker.number.int({ min: 1, max: 5 }),
          cover_image: faker.image.url({ width: 300, height: 300 }),
          create_time: faker.date.recent().getTime(),
          last_modified_time: faker.date.recent().getTime(),
          status: isAdmin
            ? faker.helpers.arrayElement([
                ORDER_STATUS.REVOKING,
                ORDER_STATUS.APPROVED,
                ORDER_STATUS.APPROVED,
              ])
            : faker.helpers.arrayElement([
                ORDER_STATUS.INITIAL,
                ORDER_STATUS.REVOKING,
                ORDER_STATUS.APPROVED,
                ORDER_STATUS.APPROVED,
              ]),
          user_id: faker.string.uuid(),
        };
      },
      {
        count: faker.number.int({ min: 12, max: 24 }),
      },
    );
  },
  [MOCK_API_NAME.UPDATE_ORDER_STATUS]: async (): Promise<void> => {
    await sleep(1000);
    return Math.random() > 0.4
      ? Promise.resolve()
      : Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '订单状态更新失败'));
  },
};
