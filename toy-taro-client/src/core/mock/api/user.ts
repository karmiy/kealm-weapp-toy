import { faker } from '@faker-js/faker';
import { sleep } from '@shared/utils/utils';
import { UserStorageManager } from '../..//base';
import { ROLE } from '../../constants';
import { ContactEntity, UserEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';
import { createMockApiCache } from '../utils';

export const mockUserApi = {
  [MOCK_API_NAME.GET_USER_INFO]: async (): Promise<UserEntity> => {
    await sleep(1000);
    const cacheUserInfo = UserStorageManager.getInstance().getUserInfo();
    if (cacheUserInfo) {
      return cacheUserInfo;
    }
    const role = Math.random() > 0.5 ? ROLE.ADMIN : ROLE.USER;
    // return Promise.reject({ code: SERVER_ERROR_CODE.LOGIN_EXPIRED });
    return {
      id: faker.string.ulid(),
      name: role === ROLE.ADMIN ? 'Little Sheep Susie' : '洪以妍',
      avatarUrl: 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/login-cover-image.png',
      role,
      score: role === ROLE.ADMIN ? undefined : faker.number.int({ min: 1, max: 100 }),
      draw_ticket: role === ROLE.ADMIN ? 1000 : faker.number.int({ min: 1, max: 10 }),
    };
  },
  [MOCK_API_NAME.USER_LOGIN]: async (): Promise<{ token: string }> => {
    await sleep(2000);
    return {
      token: faker.string.ulid(),
    };
  },
  [MOCK_API_NAME.UPLOAD_AVATAR]: async (tempUrl: string): Promise<string> => {
    await sleep(100);
    return Promise.resolve(tempUrl);
  },
  [MOCK_API_NAME.UPLOAD_PROFILE]: async (params: { name: string }): Promise<void> => {
    await sleep(100);
    return Promise.resolve();
  },
  [MOCK_API_NAME.GET_CONTACT_LIST]: createMockApiCache(async (): Promise<ContactEntity[]> => {
    await sleep(1000);
    return faker.helpers.multiple(
      () => {
        const role = Math.random() > 0.5 ? ROLE.ADMIN : ROLE.USER;
        return {
          id: faker.string.ulid(),
          name: role === ROLE.ADMIN ? 'Little Sheep Susie' : '洪以妍',
          avatarUrl:
            'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/login-cover-image.png',
          role,
          score: role === ROLE.ADMIN ? undefined : faker.number.int({ min: 1, max: 100 }),
        };
      },
      {
        count: 5,
      },
    );
  }),
};
