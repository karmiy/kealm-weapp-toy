import { faker } from '@faker-js/faker';
import { ToyEntity } from '../../entity';
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
    // cover_image: faker.image.url({ width: 300, height: 300 }),
    cover_image: coverImage,
    create_time: faker.date.recent().getTime(),
  };
};

export const mockToyApi = {
  [MOCK_API_NAME.GET_TOY_LIST]: (): ToyEntity[] => {
    return faker.helpers.multiple(createRandomToy, {
      count: 5,
    });
  },
};
