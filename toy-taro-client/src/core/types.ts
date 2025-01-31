import type { Config } from './config';
import { HANDLER_TYPE, COUPON_VALIDITY_TIME_TYPE } from './constants';
import { CouponModel } from './model';

export type ConfigModels = {
    [K in keyof Config]: InstanceType<Config[K]['model']>;
};

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
