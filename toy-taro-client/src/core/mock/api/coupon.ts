import { faker } from '@faker-js/faker';
import { endOfDay, startOfDay } from 'date-fns';
import { JsError, sleep } from '@shared/utils/utils';
import { CouponApiUpdateParams } from '../../api';
import { UserStorageManager } from '../../base';
import {
  COUPON_STATUS,
  COUPON_TYPE,
  COUPON_VALIDITY_TIME_TYPE,
  SERVER_ERROR_CODE,
} from '../../constants';
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
          last_modified_time: faker.date.recent().getTime(),
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
  [MOCK_API_NAME.DELETE_COUPON]: async (id: string): Promise<void> => {
    await sleep(100);
    return Math.random() > 0.4
      ? Promise.resolve()
      : Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '删除失败，请联系管理员'));
  },
  [MOCK_API_NAME.UPDATE_COUPON]: async (coupon: CouponApiUpdateParams): Promise<CouponEntity> => {
    await sleep(500);
    let entity: CouponEntity;
    const { validity_time_type, start_time, end_time, dates, days } = coupon;

    const validityTime = {
      type: validity_time_type,
    } as CouponValidityTime;
    if (validityTime.type === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE) {
      if (!start_time || !end_time) {
        return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '有效范围不能为空'));
      }
      validityTime.start_time = startOfDay(start_time).getTime();
      validityTime.end_time = endOfDay(end_time).getTime();
    }
    if (validityTime.type === COUPON_VALIDITY_TIME_TYPE.DATE_LIST) {
      if (!dates?.length) {
        return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '有效日期不能为空'));
      }
      validityTime.dates = dates.map(date => endOfDay(new Date(date)).getTime());
    }
    if (validityTime.type === COUPON_VALIDITY_TIME_TYPE.WEEKLY) {
      if (!days?.length) {
        return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '有效星期不能为空'));
      }
      validityTime.days = days;
    }
    const now = new Date().getTime();
    if (coupon.id) {
      const couponList = await mockCouponApi[MOCK_API_NAME.GET_COUPON_LIST]();
      const currentCoupon = couponList.find(c => c.id === coupon.id);
      if (!currentCoupon) {
        return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '优惠券不存在'));
      }
      entity = {
        ...coupon,
        id: coupon.id,
        create_time: currentCoupon.create_time,
        last_modified_time: now,
        user_id: currentCoupon.user_id,
        status: currentCoupon.status,
        validity_time: validityTime,
      };
    } else {
      entity = {
        ...coupon,
        id: faker.string.uuid(),
        create_time: now,
        last_modified_time: now,
        user_id: faker.string.ulid(),
        status: COUPON_STATUS.ACTIVE,
        validity_time: validityTime,
      };
    }
    return Math.random() > 0.4
      ? Promise.resolve(entity)
      : Promise.reject(
          new JsError(SERVER_ERROR_CODE.SERVER_ERROR, `优惠券${coupon.id ? '更新' : '创建'}失败`),
        );
  },
};
