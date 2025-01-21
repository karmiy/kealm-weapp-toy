import { HANDLER_TYPE, STORE_NAME } from './constants';
import {
  CouponModel,
  ProductCategoryModel,
  ProductModel,
  ProductShopCartModel,
  TaskCategoryModel,
  TaskModel,
  UserModel,
} from './model';

const config = {
  [STORE_NAME.PRODUCT]: {
    type: HANDLER_TYPE.MULTIPLE,
    model: ProductModel,
    sortValue: (a: ProductModel, b: ProductModel) => b.createTime - a.createTime,
  },
  [STORE_NAME.PRODUCT_CATEGORY]: {
    type: HANDLER_TYPE.MULTIPLE,
    model: ProductCategoryModel,
    sortValue: (a: ProductCategoryModel, b: ProductCategoryModel) =>
      b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.PRODUCT_SHOP_CART]: {
    type: HANDLER_TYPE.MULTIPLE,
    model: ProductShopCartModel,
    sortValue: (a: ProductShopCartModel, b: ProductShopCartModel) =>
      b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.COUPON]: {
    type: HANDLER_TYPE.MULTIPLE,
    model: CouponModel,
    sortValue: (a: CouponModel, b: CouponModel) => b.createTime - a.createTime,
  },
  [STORE_NAME.TASK]: {
    type: HANDLER_TYPE.MULTIPLE,
    model: TaskModel,
    sortValue: (a: TaskModel, b: TaskModel) => b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.TASK_CATEGORY]: {
    type: HANDLER_TYPE.MULTIPLE,
    model: TaskCategoryModel,
    sortValue: (a: TaskCategoryModel, b: TaskCategoryModel) =>
      b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.USER]: {
    type: HANDLER_TYPE.SINGLE,
    model: UserModel,
    sortValue: (a: UserModel, b: UserModel) => 1,
  },
};

type Config = typeof config;

export { config, Config };
