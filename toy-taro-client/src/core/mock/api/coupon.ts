import { faker } from '@faker-js/faker';
import { sleep } from '@shared/utils/utils';
import { UserStorageManager } from '../../base';
import { COUPON_STATUS, COUPON_TYPE, COUPON_VALIDITY_TIME_TYPE } from '../../constants';
import { CouponEntity, CouponValidityTime } from '../../entity';
import { MOCK_API_NAME } from '../constants';
import { createMockApiCache } from '../utils';

const COUPON_THEMES = [
  '节日特惠券',
  '周末特惠券',
  '会员专属券',
  '新春特惠券',
  '限时折扣券',
  '夏日狂欢券',
  '周年庆优惠券',
  '双十一特惠券',
  '儿童节优惠券',
  '购物满减券',
  '黑五特惠券',
  '圣诞节优惠券',
  '元旦特惠券',
  '国庆节优惠券',
];

function generateRandomValidityTime(): CouponValidityTime {
  const types = [
    COUPON_VALIDITY_TIME_TYPE.DATE_RANGE,
    COUPON_VALIDITY_TIME_TYPE.DATE_LIST,
    COUPON_VALIDITY_TIME_TYPE.WEEKLY,
  ];
  const selectedType = faker.helpers.arrayElement(types);

  switch (selectedType) {
    case COUPON_VALIDITY_TIME_TYPE.DATE_RANGE:
      const startTime =
        Math.random() > 0.8
          ? faker.date.soon().getTime()
          : faker.date.recent({ days: faker.number.int({ min: 1, max: 5 }) }).getTime();
      const endTime = faker.date
        .soon({ refDate: startTime, days: faker.number.int({ min: 1, max: 3 }) })
        .getTime();
      return {
        start_time: startTime,
        end_time: endTime,
        type: COUPON_VALIDITY_TIME_TYPE.DATE_RANGE,
      };

    case COUPON_VALIDITY_TIME_TYPE.DATE_LIST:
      const dates = Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () =>
        faker.date.future().getTime(),
      );
      return { dates, type: COUPON_VALIDITY_TIME_TYPE.DATE_LIST };

    case COUPON_VALIDITY_TIME_TYPE.WEEKLY:
      const days = faker.helpers
        .shuffle([1, 2, 3, 4, 5, 6, 7])
        .slice(0, faker.number.int({ min: 1, max: 3 }));
      return { days, type: COUPON_VALIDITY_TIME_TYPE.WEEKLY };

    default:
      throw new Error('Unexpected validity type');
  }
}

export const mockCouponApi = {
  [MOCK_API_NAME.GET_COUPON_LIST]: createMockApiCache(async (): Promise<CouponEntity[]> => {
    await sleep(100);
    return faker.helpers.multiple(
      () => {
        const type = faker.helpers.arrayElement([
          COUPON_TYPE.CASH_DISCOUNT,
          COUPON_TYPE.PERCENTAGE_DISCOUNT,
        ]);
        const value =
          type === COUPON_TYPE.CASH_DISCOUNT
            ? faker.number.int({ min: 1, max: 100 })
            : faker.number.int({ min: 10, max: 99 });
        const isAdmin = UserStorageManager.getInstance().isAdmin;
        return {
          id: faker.string.uuid(),
          name: faker.helpers.arrayElement(COUPON_THEMES),
          user_id: faker.string.ulid(),
          create_time: faker.date.recent().getTime(),
          validity_time: generateRandomValidityTime(),
          status: !isAdmin
            ? faker.helpers.arrayElement([COUPON_STATUS.ACTIVE, COUPON_STATUS.USED])
            : COUPON_STATUS.ACTIVE,
          type,
          value,
          minimum_order_value: faker.helpers.arrayElement([
            0,
            faker.number.int({ min: 1, max: type === COUPON_TYPE.CASH_DISCOUNT ? value : 100 }),
          ]),
        };
      },
      {
        count: faker.number.int({ min: 16, max: 36 }),
      },
    );
  }),
};
