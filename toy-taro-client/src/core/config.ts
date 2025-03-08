import { HANDLER_TYPE, LUCKY_DRAW_TYPE, STORE_NAME } from './constants';
import {
  CheckInModel,
  ContactModel,
  CouponModel,
  LuckyDrawModel,
  OrderModel,
  PrizeModel,
  ProductCategoryModel,
  ProductModel,
  ProductShopCartModel,
  TaskCategoryModel,
  TaskFlowModel,
  TaskModel,
  UserCouponModel,
  UserModel,
} from './model';

const config = {
  [STORE_NAME.PRODUCT]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: ProductModel,
    sortValue: (a: ProductModel, b: ProductModel) => b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.PRODUCT_CATEGORY]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: ProductCategoryModel,
    sortValue: (a: ProductCategoryModel, b: ProductCategoryModel) =>
      b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.PRODUCT_SHOP_CART]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: ProductShopCartModel,
    sortValue: (a: ProductShopCartModel, b: ProductShopCartModel) =>
      b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.COUPON]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: CouponModel,
    sortValue: (a: CouponModel, b: CouponModel) => b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.USER_COUPON]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: UserCouponModel,
    sortValue: (a: UserCouponModel, b: UserCouponModel) => b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.TASK]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: TaskModel,
    sortValue: (a: TaskModel, b: TaskModel) => b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.TASK_FLOW]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: TaskFlowModel,
    sortValue: (a: TaskFlowModel, b: TaskFlowModel) => b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.TASK_CATEGORY]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: TaskCategoryModel,
    sortValue: (a: TaskCategoryModel, b: TaskCategoryModel) =>
      b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.USER]: {
    type: HANDLER_TYPE.SINGLE as const,
    model: UserModel,
    sortValue: (a: UserModel, b: UserModel) => 1,
  },
  [STORE_NAME.CONTACT]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: ContactModel,
    sortValue: (a: ContactModel, b: ContactModel) => a.id.localeCompare(b.id),
  },
  [STORE_NAME.ORDER]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: OrderModel,
    sortValue: (a: OrderModel, b: OrderModel) => b.lastModifiedTime - a.lastModifiedTime,
  },
  [STORE_NAME.CHECK_IN]: {
    type: HANDLER_TYPE.SINGLE as const,
    model: CheckInModel,
    sortValue: (a: CheckInModel, b: CheckInModel) => 1,
  },
  [STORE_NAME.PRIZE]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: PrizeModel,
    sortValue: (a: PrizeModel, b: PrizeModel) => b.sortValue - a.sortValue,
  },
  [STORE_NAME.LUCKY_DRAW]: {
    type: HANDLER_TYPE.MULTIPLE as const,
    model: LuckyDrawModel,
    sortValue: (a: LuckyDrawModel, b: LuckyDrawModel) => {
      return a.type === b.type
        ? b.quantity - a.quantity // 相同 type 按券数降序
        : a.type === LUCKY_DRAW_TYPE.WHEEL
        ? -1
        : 1;
    },
  },
};

type Config = typeof config;

export { config, Config };
