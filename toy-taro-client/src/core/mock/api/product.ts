import { faker } from '@faker-js/faker';
import { endOfDay, startOfDay, startOfToday, startOfTomorrow } from 'date-fns';
import { JsError, sleep } from '@shared/utils/utils';
import { ProductApiUpdateParams } from '../../api';
import { SERVER_ERROR_CODE } from '../../constants';
import { ProductCategoryEntity, ProductEntity, ProductShopCartEntity } from '../../entity';
import { MOCK_API_NAME } from '../constants';
import { createMockApiCache } from '../utils';

const CATEGORY_LIST = [
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

const createRandomProduct = (): ProductEntity => {
  const originScore = faker.number.int({ min: 2, max: 100 });
  const coverImage = faker.helpers.arrayElement([
    'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-limited-time-offer-1.png',
    'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-limited-time-offer-2.png',
    'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-limited-time-offer-3.png',
  ]);
  const categoryIds = CATEGORY_LIST.map(item => item.id);
  const discountedScore =
    Math.random() > 0.9 ? faker.number.int({ min: 1, max: originScore - 1 }) : undefined;
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    desc: faker.commerce.productDescription(),
    discounted_score: discountedScore,
    original_score: originScore,
    stock: faker.number.int({ min: 2, max: 10 }),
    cover_image: faker.image.url({ width: 300, height: 300 }),
    // cover_image: coverImage,
    create_time: faker.date.recent().getTime(),
    last_modified_time: faker.date.recent().getTime(),
    flash_sale_start: discountedScore ? startOfToday().getTime() : undefined,
    flash_sale_end: discountedScore
      ? Math.random() > 0.5
        ? startOfTomorrow().getTime()
        : startOfToday().getTime()
      : undefined,
    category_id: categoryIds[Math.floor(Math.random() * categoryIds.length)],
  };
};

export const mockProductApi = {
  [MOCK_API_NAME.GET_PRODUCT_LIST]: createMockApiCache(async (): Promise<ProductEntity[]> => {
    await sleep(100);
    return faker.helpers.multiple(createRandomProduct, {
      count: 100,
    });
  }),
  [MOCK_API_NAME.GET_PRODUCT_CATEGORY_LIST]: createMockApiCache(
    async (): Promise<ProductCategoryEntity[]> => {
      await sleep(100);
      return CATEGORY_LIST.map(item => ({
        ...item,
        create_time: faker.date.recent().getTime(),
        last_modified_time: faker.date.recent().getTime(),
      }));
    },
  ),
  [MOCK_API_NAME.GET_PRODUCT_SHOP_CART]: async (): Promise<ProductShopCartEntity[]> => {
    const productList = await mockProductApi[MOCK_API_NAME.GET_PRODUCT_LIST]();
    return faker.helpers.multiple(
      () => {
        return {
          id: faker.string.uuid(),
          product_id: faker.helpers.arrayElement(productList).id,
          user_id: faker.string.ulid(),
          create_time: faker.date.recent().getTime(),
          last_modified_time: faker.date.recent().getTime(),
          quantity: faker.number.int({ min: 1, max: 2 }),
        };
      },
      {
        count: faker.number.int({ min: 2, max: 8 }),
      },
    );
  },
  [MOCK_API_NAME.UPDATE_PRODUCT_SHOP_CART]: async (params: {
    id?: string;
    quantity: number;
    productId: string;
  }): Promise<ProductShopCartEntity> => {
    const { id, quantity, productId } = params;
    const now = new Date().getTime();
    const entity = {
      id: `${now}-${productId}`,
      product_id: productId,
      user_id: 'user_id',
      create_time: now,
      last_modified_time: now,
      quantity,
    };
    return Math.random() > 0.5
      ? Promise.resolve(entity)
      : Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '操作失败，请联系管理员'));
  },
  [MOCK_API_NAME.DELETE_PRODUCT_SHOP_CART]: async (id: string) => {
    return Math.random() > 0.4
      ? Promise.resolve({})
      : Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '购物车删除失败'));
  },
  [MOCK_API_NAME.UPDATE_PRODUCT]: async (
    product: ProductApiUpdateParams,
  ): Promise<ProductEntity> => {
    await sleep(500);
    let entity: ProductEntity;
    const { discounted_score, flash_sale_start, flash_sale_end } = product;

    if (typeof discounted_score === 'number' && (!flash_sale_start || !flash_sale_end)) {
      return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '特惠时间不能为空'));
    }
    const now = new Date().getTime();
    if (product.id) {
      const productList = await mockProductApi[MOCK_API_NAME.GET_PRODUCT_LIST]();
      const currentProduct = productList.find(c => c.id === product.id);
      if (!currentProduct) {
        return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '商品不存在'));
      }
      entity = {
        ...product,
        id: product.id,
        create_time: currentProduct.create_time,
        last_modified_time: now,
        flash_sale_start: flash_sale_start ? startOfDay(flash_sale_start).getTime() : undefined,
        flash_sale_end: flash_sale_end ? endOfDay(flash_sale_end).getTime() : undefined,
      };
    } else {
      entity = {
        ...product,
        id: faker.string.uuid(),
        create_time: now,
        last_modified_time: now,
        flash_sale_start: flash_sale_start ? startOfDay(flash_sale_start).getTime() : undefined,
        flash_sale_end: flash_sale_end ? endOfDay(flash_sale_end).getTime() : undefined,
      };
    }
    return Math.random() > 0.4
      ? Promise.resolve(entity)
      : Promise.reject(
          new JsError(SERVER_ERROR_CODE.SERVER_ERROR, `商品${product.id ? '更新' : '创建'}失败`),
        );
  },
  [MOCK_API_NAME.UPDATE_PRODUCT_CATEGORY]: async (productCategory: {
    id?: string;
    name: string;
  }): Promise<ProductCategoryEntity> => {
    await sleep(500);
    let entity: ProductCategoryEntity;
    const now = new Date().getTime();
    if (productCategory.id) {
      const productCategoryList = await mockProductApi[MOCK_API_NAME.GET_PRODUCT_CATEGORY_LIST]();
      const currentProductCategory = productCategoryList.find(c => c.id === productCategory.id);
      if (!currentProductCategory) {
        return Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '商品分类不存在'));
      }
      entity = {
        ...productCategory,
        id: productCategory.id,
        create_time: currentProductCategory.create_time,
        last_modified_time: now,
      };
    } else {
      entity = {
        id: faker.string.uuid(),
        name: productCategory.name,
        create_time: now,
        last_modified_time: now,
      };
    }
    return Math.random() > 0.4
      ? Promise.resolve(entity)
      : Promise.reject(
          new JsError(
            SERVER_ERROR_CODE.SERVER_ERROR,
            `商品分类${productCategory.id ? '更新' : '创建'}失败`,
          ),
        );
  },
  [MOCK_API_NAME.DELETE_PRODUCT]: async (id: string): Promise<void> => {
    await sleep(100);
    return Math.random() > 0.4
      ? Promise.resolve()
      : Promise.reject(new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '删除失败，请联系管理员'));
  },
  [MOCK_API_NAME.DELETE_PRODUCT_CATEGORY]: async (id: string): Promise<void> => {
    await sleep(100);
    return Math.random() > 0.4
      ? Promise.resolve()
      : Promise.reject(
          new JsError(SERVER_ERROR_CODE.SERVER_ERROR, '删除失败，请先删除分类下的相关商品'),
        );
  },
};
