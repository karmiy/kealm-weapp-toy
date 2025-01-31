import { faker } from '@faker-js/faker';
import { JsError, sleep } from '@shared/utils/utils';
import { CHECK_IN_RULE_REWARD_TYPE, CHECK_IN_RULE_TYPE, SERVER_ERROR_CODE } from '../../constants';
import { CheckInEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';

function generateCheckInDays(params: { total: number; streak: number; count: number }) {
  const { total, streak, count } = params;
  const array: number[] = [];
  const start = Math.floor(Math.random() * (total - streak + 1)) + 1;
  for (let i = 0; i < streak; i++) {
    array.push(start + i);
  }

  while (array.length < count) {
    const randomNum = Math.floor(Math.random() * total) + 1;
    if (!array.includes(randomNum)) {
      array.push(randomNum);
    }
  }
  return array;
}

export const mockCheckInApi = {
  [MOCK_API_NAME.GET_CHECK_IN_INFO]: async (): Promise<CheckInEntity> => {
    await sleep(1000);
    const currentDay = new Date().getDate();
    const streak = faker.number.int({ min: 3, max: currentDay });
    const rewardValue = faker.number.int({ min: 1, max: 99 });
    return {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      days: generateCheckInDays({
        total: currentDay,
        streak,
        count: faker.number.int({ min: streak, max: currentDay }),
      }),
      rules: faker.helpers.multiple(
        () => {
          return {
            id: faker.string.uuid(),
            type: faker.helpers.arrayElement([
              CHECK_IN_RULE_TYPE.CUMULATIVE,
              CHECK_IN_RULE_TYPE.STREAK,
            ]),
            value: faker.number.int({ min: 1, max: currentDay }),
            reward: {
              type: faker.helpers.arrayElement([
                CHECK_IN_RULE_REWARD_TYPE.POINTS,
                CHECK_IN_RULE_REWARD_TYPE.CASH_DISCOUNT,
                CHECK_IN_RULE_REWARD_TYPE.PERCENTAGE_DISCOUNT,
              ]),
              value: rewardValue,
              minimumOrderValue: faker.number.int({ min: rewardValue, max: 99 }),
              is_claimed: Math.random() > 0.5,
            },
          };
        },
        { count: 5 },
      ),
    };
  },
  [MOCK_API_NAME.CLAIM_REWARD]: async (): Promise<void> => {
    await sleep(1000);
    return Math.random() > 0.5
      ? Promise.resolve()
      : Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '操作失败，请联系管理员'));
  },
  [MOCK_API_NAME.CHECK_IN_TODAY]: async (): Promise<void> => {
    await sleep(1000);
    return Math.random() > 0.5
      ? Promise.resolve()
      : Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '操作失败，请联系管理员'));
  },
};
