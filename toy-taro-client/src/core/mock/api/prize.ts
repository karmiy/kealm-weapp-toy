import { faker } from '@faker-js/faker';
import { JsError, sleep } from '@shared/utils/utils';
// import { UserStorageManager } from '../../base';
import { COUPON_STATUS, PRIZE_TYPE, SERVER_ERROR_CODE } from '../../constants';
import { PrizeEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';
import { mockCouponApi } from './coupon';

export const mockPrizeApi = {
  [MOCK_API_NAME.GET_PRIZE_LIST]: async (): Promise<PrizeEntity[]> => {
    await sleep(1000);
    const couponList = await mockCouponApi.GET_COUPON_LIST();
    const activeCouponIds = couponList
      .filter(item => item.status === COUPON_STATUS.ACTIVE)
      .map(item => item.id);
    return faker.helpers.multiple(
      () => {
        // const isAdmin = UserStorageManager.getInstance().isAdmin;
        const points = faker.number.int({ min: 1, max: 100 });
        const type = faker.helpers.arrayElement([PRIZE_TYPE.POINTS, PRIZE_TYPE.COUPON]);
        const isCoupon = type === PRIZE_TYPE.COUPON;
        const isPoints = type === PRIZE_TYPE.POINTS;
        return {
          id: faker.string.uuid(),
          type,
          coupon_id: isCoupon ? faker.helpers.arrayElement(activeCouponIds) : undefined,
          points: isPoints ? points : undefined,
          sort_value: faker.number.int({ min: 1, max: 100 }),
          create_time: faker.date.recent().getTime(),
          last_modified_time: faker.date.recent().getTime(),
        };
      },
      {
        count: faker.number.int({ min: 12, max: 24 }),
      },
    );
  },
};
