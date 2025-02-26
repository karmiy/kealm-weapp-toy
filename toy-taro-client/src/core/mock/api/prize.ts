import { faker } from '@faker-js/faker';
import { JsError, sleep } from '@shared/utils/utils';
import { PrizeApiUpdateParams } from '../..//api';
// import { UserStorageManager } from '../../base';
import { COUPON_STATUS, PRIZE_TYPE, SERVER_ERROR_CODE } from '../../constants';
import { PrizeEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';
import { createMockApiCache } from '../utils';
import { mockCouponApi } from './coupon';

const mockGetPrizeListApiCache = createMockApiCache(async (): Promise<PrizeEntity[]> => {
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
        sort_value: mockPrizeApi.sortValue++,
        create_time: faker.date.recent().getTime(),
        last_modified_time: faker.date.recent().getTime(),
      };
    },
    {
      count: faker.number.int({ min: 12, max: 24 }),
    },
  );
});

export const mockPrizeApi = {
  sortValue: 1,
  [MOCK_API_NAME.GET_PRIZE_LIST]: mockGetPrizeListApiCache,
  [MOCK_API_NAME.DELETE_PRIZE]: async (id: string): Promise<void> => {
    await sleep(1000);
    const throwError = Math.random() <= 0.4;
    if (throwError) {
      return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '删除失败，请联系管理员'));
    }
    const prizeList = await mockPrizeApi.GET_PRIZE_LIST();
    const index = prizeList.findIndex(item => item.id === id);
    const list = [...prizeList];
    list.splice(index, 1);
    mockGetPrizeListApiCache.update(list);
    return Promise.resolve();
  },
  [MOCK_API_NAME.UPDATE_PRIZE]: async (prize: PrizeApiUpdateParams): Promise<PrizeEntity> => {
    await sleep(1000);
    const throwError = Math.random() <= 0.4;
    if (throwError) {
      return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '更新失败，请联系管理员'));
    }
    let entity: PrizeEntity;
    const prizeList = await mockPrizeApi.GET_PRIZE_LIST();
    if (prize.id) {
      const index = prizeList.findIndex(item => item.id === prize.id);
      const prevEntity = prizeList[index];
      if (!prevEntity) {
        return Promise.reject(
          new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '更新失败，更新的奖品不存在'),
        );
      }
      entity = {
        id: prize.id,
        type: prize.type,
        points: prize.type === PRIZE_TYPE.POINTS ? prize.points : undefined,
        coupon_id: prize.type === PRIZE_TYPE.COUPON ? prize.coupon_id : undefined,
        sort_value: prevEntity.sort_value,
        create_time: prevEntity.create_time,
        last_modified_time: prevEntity.last_modified_time,
      };
      const list = [...prizeList];
      list.splice(index, 1, entity);
      mockGetPrizeListApiCache.update(list);
    } else {
      entity = {
        id: faker.string.uuid(),
        type: prize.type,
        points: prize.points,
        coupon_id: prize.coupon_id,
        sort_value: mockPrizeApi.sortValue++,
        create_time: faker.date.recent().getTime(),
        last_modified_time: faker.date.recent().getTime(),
      };
      mockGetPrizeListApiCache.update([...prizeList, entity]);
    }
    return Promise.resolve(entity);
  },
  [MOCK_API_NAME.SORT_PRIZE]: async (
    ids: string[],
  ): Promise<Array<{ id: string; sort_value: number }>> => {
    const throwError = Math.random() <= 0.4;
    if (throwError) {
      return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '排序失败，请联系管理员'));
    }
    const prizeList = await mockPrizeApi.GET_PRIZE_LIST();
    const sortValues = prizeList
      .filter(item => ids.includes(item.id))
      .map(item => item.sort_value)
      .sort((a, b) => b - a);
    if (sortValues.length !== ids.length) {
      return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '排序失败，存在无效 id'));
    }
    const idToSortValue = new Map<string, number>();
    ids.forEach((id, index) => {
      idToSortValue.set(id, sortValues[index]);
    });

    prizeList.forEach(item => {
      if (idToSortValue.has(item.id)) {
        item.sort_value = idToSortValue.get(item.id)!;
      }
    });

    const response = [...idToSortValue.entries()].map(([id, sort_value]) => {
      return {
        id,
        sort_value,
      };
    });
    return Promise.resolve(response);
  },
};
