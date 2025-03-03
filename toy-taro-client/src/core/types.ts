import type { Config } from './config';
import {
    CheckInModule,
    CouponModule,
    OrderModule,
    ProductModule,
    TaskModule,
    UserModule,
    PrizeModule,
    LuckyDrawModule,
  } from './module';
import { HANDLER_TYPE, COUPON_VALIDITY_TIME_TYPE, PRIZE_TYPE } from './constants';
import { CouponModel, TaskModel, ProductModel, LuckyDrawModel } from './model';

 // ----------------------storeManager--------------------------------
export type ConfigModels = {
    [K in keyof Config]: InstanceType<Config[K]['model']>;
};

export type GetModel<T extends keyof ConfigModels> = ConfigModels[T];

export type Models = {
    [K in keyof ConfigModels]: ConfigModels[K];
}[keyof ConfigModels];

export type HasCategoryId<T> = T extends { categoryId: string } ? T : never;

export type StoreNamesWithCategoryId = {
    [K in keyof ConfigModels]: HasCategoryId<ConfigModels[K]> extends never ? never : K;
}[keyof ConfigModels];

export type ModelsWithCategoryId = {
    [K in keyof ConfigModels]: HasCategoryId<ConfigModels[K]>;
}[keyof ConfigModels];

export type SingleStoreNames = {
    [K in keyof Config]: Config[K]['type'] extends HANDLER_TYPE.SINGLE ? K : never;
}[keyof Config];

 // ----------------------sdk--------------------------------
 export type Modules = {
    product: ProductModule;
    user: UserModule;
    coupon: CouponModule;
    task: TaskModule;
    order: OrderModule;
    checkIn: CheckInModule;
    prize: PrizeModule;
    luckyDraw: LuckyDrawModule;
};

export type ISDK = {
    modules: Modules;
};

 // ----------------------product--------------------------------
 export type ProductUpdateParams = Pick<
  ProductModel,
  'name' | 'desc' | 'discountedScore' | 'originalScore' | 'stock' | 'coverImage' | 'categoryId'
> & { 
    id?: string;
    flashSaleStart?: string;
    flashSaleEnd?: string;
 };

// ----------------------coupon--------------------------------
export type CouponUpdateParams = Pick<
  CouponModel,
  'name' | 'minimumOrderValue' | 'type' | 'value'
> & { 
    id?: string;
    validityTimeType: COUPON_VALIDITY_TIME_TYPE;
    dates?: string[];
    days?: number[];
    startTime?: string;
    endTime?: string;
 };

 // ----------------------task--------------------------------
export type TaskUpdateParams = Pick<
  TaskModel,
  'name' | 'desc' | 'type' | 'categoryId' | 'difficulty'
> & { 
  id?: string;
  prizeId: string;
};

// ----------------------prize--------------------------------
export type PrizeUpdateParams = {
    id?: string;
    type: PRIZE_TYPE;
    couponId?: string;
    points?: number;
    drawCount?: number;
    text?: string;
}

// ----------------------luckyDraw--------------------------------
export type LuckyDrawUpdateParams = Pick<
  LuckyDrawModel,
  'type' | 'coverImage' | 'name' | 'quantity' | 'list'
> & { 
    id?: string;
 };