import { faker } from '@faker-js/faker';
import { JsError, sleep } from '@shared/utils/utils';
import { LuckyDrawApiUpdateParams } from '../../api';
// import { UserStorageManager } from '../../base';
import { LUCKY_DRAW_TYPE, PRIZE_TYPE, SERVER_ERROR_CODE } from '../../constants';
import { LuckyDrawEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';
import { createMockApiCache } from '../utils';
import { mockPrizeApi } from './prize';

const mockGetLuckyDrawListApiCache = createMockApiCache(async (): Promise<LuckyDrawEntity[]> => {
  await sleep(1000);
  const prizeList = (await mockPrizeApi.GET_PRIZE_LIST()).filter(
    item => item.type !== PRIZE_TYPE.LUCKY_DRAW,
  );
  return faker.helpers.multiple(
    () => {
      // const isAdmin = UserStorageManager.getInstance().isAdmin;
      const type = faker.helpers.arrayElement([LUCKY_DRAW_TYPE.GRID, LUCKY_DRAW_TYPE.WHEEL]);
      return {
        id: faker.string.uuid(),
        type,
        cover_image: faker.helpers.arrayElement([
          'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-lucky-cover-1.png',
          'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-lucky-cover-2.png',
          'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-lucky-cover-3.png',
          'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-lucky-cover-4.png',
        ]),
        name: faker.lorem.words(3),
        quantity: faker.number.int({ min: 1, max: 4 }),
        list: faker.helpers.multiple(
          () => {
            return {
              prize_id: faker.helpers.arrayElement(prizeList.map(item => item.id)),
              range: faker.number.int({ min: 1, max: 50 }),
            };
          },
          { count: faker.number.int({ min: 8, max: type === LUCKY_DRAW_TYPE.WHEEL ? 10 : 24 }) },
        ),
        create_time: faker.date.recent().getTime(),
        last_modified_time: faker.date.recent().getTime(),
      };
    },
    {
      count: faker.number.int({ min: 1, max: 5 }),
    },
  );
});

export const mockLuckyDrawApi = {
  sortValue: 1,
  [MOCK_API_NAME.GET_LUCKY_DRAW_LIST]: mockGetLuckyDrawListApiCache,
  [MOCK_API_NAME.DELETE_LUCKY_DRAW]: async (id: string): Promise<void> => {
    await sleep(1000);
    const throwError = Math.random() <= 0.4;
    if (throwError) {
      return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '删除失败，请联系管理员'));
    }
    const luckyDrawList = await mockLuckyDrawApi.GET_LUCKY_DRAW_LIST();
    const index = luckyDrawList.findIndex(item => item.id === id);
    const list = [...luckyDrawList];
    list.splice(index, 1);
    mockGetLuckyDrawListApiCache.update(list);
    return Promise.resolve();
  },
  [MOCK_API_NAME.UPDATE_LUCKY_DRAW]: async (
    luckyDraw: LuckyDrawApiUpdateParams,
  ): Promise<LuckyDrawEntity> => {
    await sleep(1000);
    const throwError = Math.random() <= 0.4;
    if (throwError) {
      return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '更新失败，请联系管理员'));
    }
    let entity: LuckyDrawEntity;
    const luckyDrawList = await mockLuckyDrawApi.GET_LUCKY_DRAW_LIST();
    if (luckyDraw.id) {
      const index = luckyDrawList.findIndex(item => item.id === luckyDraw.id);
      const prevEntity = luckyDrawList[index];
      if (!prevEntity) {
        return Promise.reject(
          new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '更新失败，更新的奖品不存在'),
        );
      }
      entity = {
        id: luckyDraw.id,
        type: luckyDraw.type,
        cover_image: luckyDraw.cover_image,
        name: luckyDraw.name,
        quantity: luckyDraw.quantity,
        list: luckyDraw.list,
        create_time: prevEntity.create_time,
        last_modified_time: prevEntity.last_modified_time,
      };
      const list = [...luckyDrawList];
      list.splice(index, 1, entity);
      mockGetLuckyDrawListApiCache.update(list);
    } else {
      entity = {
        id: faker.string.uuid(),
        type: luckyDraw.type,
        cover_image: luckyDraw.cover_image,
        name: luckyDraw.name,
        quantity: luckyDraw.quantity,
        list: luckyDraw.list,
        create_time: faker.date.recent().getTime(),
        last_modified_time: faker.date.recent().getTime(),
      };
      mockGetLuckyDrawListApiCache.update([...luckyDrawList, entity]);
    }
    return Promise.resolve(entity);
  },
};
