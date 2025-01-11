import { faker } from '@faker-js/faker';
import { startOfToday, startOfTomorrow } from 'date-fns';
import { ToyCategory, ToyEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';

const createRandomToy = (): ToyEntity => {
  const originScore = faker.number.int({ min: 2, max: 100 });
  const coverImage = faker.helpers.arrayElement([
    'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-limited-time-offer-1.png',
    'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-limited-time-offer-2.png',
    'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-limited-time-offer-3.png',
  ]);
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    desc: faker.commerce.productDescription(),
    discounted_score:
      Math.random() > 0.5 ? faker.number.int({ min: 1, max: originScore - 1 }) : undefined,
    original_score: originScore,
    stock: faker.number.int({ min: 1, max: 10 }),
    cover_image: faker.image.url({ width: 300, height: 300 }),
    // cover_image: coverImage,
    create_time: faker.date.recent().getTime(),
    flash_sale_start: startOfToday().getTime(),
    flash_sale_end: Math.random() > 0.6 ? startOfTomorrow().getTime() : startOfToday().getTime(),
  };
};

export const mockToyApi = {
  [MOCK_API_NAME.GET_TOY_LIST]: (): ToyEntity[] => {
    return faker.helpers.multiple(createRandomToy, {
      count: 10,
    });
  },
  [MOCK_API_NAME.GET_TOY_CATEGORY_LIST]: (): ToyCategory[] => {
    return [
      { id: '1', name: '卡牌' },
      { id: '2', name: '美乐蒂' },
      { id: '3', name: '玩偶' },
      { id: '4', name: '赛车' },
      { id: '5', name: '益智游戏' },
      { id: '6', name: '泡泡玛特' },
      { id: '7', name: '贴纸' },
      { id: '8', name: '安静书' },
      { id: '9', name: '文具' },
    ];
  },
};
