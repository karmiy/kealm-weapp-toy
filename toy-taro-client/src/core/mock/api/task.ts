import { faker } from '@faker-js/faker';
import { sleep } from '@shared/utils/utils';
import { UserStorageManager } from '../../base';
import {
  COUPON_STATUS,
  COUPON_TYPE,
  COUPON_VALIDITY_TIME_TYPE,
  TASK_REWARD_TYPE,
  TASK_STATUS,
  TASK_TYPE,
} from '../../constants';
import { CouponEntity, TaskCategoryEntity, TaskEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';
import { mockCouponApi } from './coupon';

const verbNounMap: Record<string, string[]> = {
  完成: ['今日阅读任务', '功课', '数学练习', '拼图300片', '拼图500片', '拼图1000片', '英语听力'],
  跳绳: ['50下', '100下', '200下'],
  背诵: ['英语单词', '语文课本', '数学乘法表', '古诗一首'],
  画一幅: ['油画', '水彩画', '简笔画', '素描'],
  整理: ['房间', '功课', '书包', '书桌', '玩具'],
  帮忙: ['洗碗', '扫地', '拖地', '洗衣服', '晾衣服', '叠衣服', '叠被子'],
  制作一件: ['手工艺品', '咕卡'],
};

// 根据映射生成句子
function generateTaskTitles() {
  const tasks: string[] = [];
  for (const [verb, nouns] of Object.entries(verbNounMap)) {
    if (nouns.length > 0) {
      nouns.forEach(noun => {
        tasks.push(`${verb}${noun}`);
      });
    } else {
      tasks.push(verb);
    }
  }
  return tasks;
}
const taskTitles = generateTaskTitles();

function getRandomTaskTitle() {
  const randomIndex = Math.floor(Math.random() * taskTitles.length);
  return taskTitles[randomIndex];
}

const CATEGORY_LIST = [
  { id: '1', name: '学习' },
  { id: '2', name: '运动' },
  { id: '3', name: '生活' },
  { id: '4', name: '兴趣' },
  { id: '5', name: '工作' },
  { id: '6', name: '健康' },
  { id: '7', name: '社交' },
  { id: '8', name: '环保' },
  { id: '9', name: '志愿服务' },
  { id: '10', name: '技能提升' },
  { id: '11', name: '旅行' },
  { id: '12', name: '财务' },
  { id: '13', name: '创造' },
  { id: '14', name: '休息' },
  { id: '15', name: '自我提升' },
];

function isCouponExpired(coupon: CouponEntity) {
  if (coupon.validity_time.type === COUPON_VALIDITY_TIME_TYPE.WEEKLY) {
    return false;
  }
  const now = new Date().getTime();
  if (coupon.validity_time.type === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE) {
    return coupon.validity_time.end_time < now;
  }
  if (coupon.validity_time.type === COUPON_VALIDITY_TIME_TYPE.DATE_LIST) {
    const { dates } = coupon.validity_time;
    return !dates.some(date => date >= now);
  }

  return true;
}

export const mockTaskApi = {
  [MOCK_API_NAME.GET_TASK_CATEGORY_LIST]: async (): Promise<TaskCategoryEntity[]> => {
    await sleep(300);
    return CATEGORY_LIST.map(item => ({
      ...item,
      create_time: faker.date.recent().getTime(),
      last_modified_time: faker.date.recent().getTime(),
    }));
  },
  [MOCK_API_NAME.GET_TASK_LIST]: async (): Promise<TaskEntity[]> => {
    await sleep(300);
    const categoryIds = CATEGORY_LIST.map(item => item.id);
    const coupons = await mockCouponApi[MOCK_API_NAME.GET_COUPON_LIST]();
    const activeCoupons = coupons.filter(
      coupon => coupon.status === COUPON_STATUS.ACTIVE && !isCouponExpired(coupon),
    );
    return faker.helpers.multiple(
      () => {
        const name = faker.helpers.arrayElement(taskTitles);
        const isAdmin = UserStorageManager.getInstance().isAdmin;
        const type = faker.helpers.arrayElement([
          TASK_REWARD_TYPE.POINTS,
          TASK_REWARD_TYPE.CASH_DISCOUNT,
          TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT,
        ]);
        const coupon = faker.helpers.arrayElement(activeCoupons);
        const reward =
          type === TASK_REWARD_TYPE.POINTS || !coupon
            ? {
                type: TASK_REWARD_TYPE.POINTS as const,
                value: faker.number.int({ min: 10, max: 99 }),
              }
            : {
                type:
                  coupon.type === COUPON_TYPE.CASH_DISCOUNT
                    ? (TASK_REWARD_TYPE.CASH_DISCOUNT as const)
                    : (TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT as const),
                couponId: coupon.id,
                minimumOrderValue: coupon.minimum_order_value,
                value: coupon.value,
              };
        return {
          id: faker.string.uuid(),
          name,
          desc: `在${faker.date.soon().toLocaleString()}之前${name}，并${getRandomTaskTitle()}`,
          type: faker.helpers.arrayElement([
            TASK_TYPE.DAILY,
            TASK_TYPE.WEEKLY,
            TASK_TYPE.TIMED,
            TASK_TYPE.CHALLENGE,
          ]),
          category_id: faker.helpers.arrayElement(categoryIds),
          status: !isAdmin
            ? faker.helpers.arrayElement([TASK_STATUS.INITIAL, TASK_STATUS.PENDING_APPROVAL])
            : undefined,
          reward,
          difficulty: faker.number.int({ min: 1, max: 5 }),
          user_id: faker.string.ulid(),
          create_time: faker.date.recent().getTime(),
          last_modified_time: faker.date.recent().getTime(),
        };
      },
      {
        count: faker.number.int({ min: 80, max: 118 }),
      },
    );
  },
  [MOCK_API_NAME.SUBMIT_APPROVAL_REQUEST]: async (id: string): Promise<void> => {
    await sleep(800);
    return Math.random() > 0.5 ? Promise.resolve() : Promise.reject();
  },
};
