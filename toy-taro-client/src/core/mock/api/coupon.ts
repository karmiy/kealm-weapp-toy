import { faker } from '@faker-js/faker';
import { sleep } from '@shared/utils/utils';
import { COUPON_STATUS, COUPON_TYPE } from '../../constants';
import { CouponEntity, CouponValidityTime } from '../../entity';
import { MOCK_API_NAME } from '../constants';

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
  const types = ['dateRange', 'dateList', 'weekly'];
  const selectedType = faker.helpers.arrayElement(types);

  switch (selectedType) {
    case 'dateRange':
      const startTime =
        Math.random() > 0.8
          ? faker.date.soon().getTime()
          : faker.date.recent({ days: faker.number.int({ min: 1, max: 5 }) }).getTime();
      const endTime = faker.date
        .soon({ refDate: startTime, days: faker.number.int({ min: 1, max: 3 }) })
        .getTime();
      return { start_time: startTime, end_time: endTime };

    case 'dateList':
      const dates = Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () =>
        faker.date.future().getTime(),
      );
      return { dates };

    case 'weekly':
      const days = faker.helpers
        .shuffle([1, 2, 3, 4, 5, 6, 7])
        .slice(0, faker.number.int({ min: 1, max: 3 }));
      return { days };

    default:
      throw new Error('Unexpected validity type');
  }
}

export const mockCouponApi = {
  [MOCK_API_NAME.GET_COUPON_LIST]: async (): Promise<CouponEntity[]> => {
    return faker.helpers.multiple(
      () => {
        const type = faker.helpers.arrayElement([
          COUPON_TYPE.CASH_DISCOUNT,
          COUPON_TYPE.PERCENTAGE_DISCOUNT,
        ]);
        return {
          id: faker.string.uuid(),
          name: faker.helpers.arrayElement(COUPON_THEMES),
          user_id: faker.string.ulid(),
          create_time: faker.date.recent().getTime(),
          validity_time: generateRandomValidityTime(),
          status: faker.helpers.arrayElement([COUPON_STATUS.ACTIVE, COUPON_STATUS.USED]),
          type,
          value:
            type === COUPON_TYPE.CASH_DISCOUNT
              ? faker.number.int({ min: 1, max: 100 })
              : faker.number.int({ min: 10, max: 99 }),
          minimum_order_value: faker.helpers.arrayElement([
            0,
            faker.number.int({ min: 1, max: 100 }),
          ]),
        };
      },
      {
        count: faker.number.int({ min: 16, max: 36 }),
      },
    );
  },
};
