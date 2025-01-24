import type { Config } from './config';
import { HANDLER_TYPE } from './constants';

type ConfigModels = {
    [K in keyof Config]: InstanceType<Config[K]['model']>;
};

type HasCategoryId<T> = T extends { categoryId: string } ? T : never;

type StoreNamesWithCategoryId = {
    [K in keyof ConfigModels]: HasCategoryId<ConfigModels[K]> extends never ? never : K;
}[keyof ConfigModels];

type ModelsWithCategoryId = {
    [K in keyof ConfigModels]: HasCategoryId<ConfigModels[K]>;
}[keyof ConfigModels];

type SingleStoreNames = {
    [K in keyof Config]: Config[K]['type'] extends HANDLER_TYPE.SINGLE ? K : never;
}[keyof Config];

export { StoreNamesWithCategoryId, ModelsWithCategoryId, SingleStoreNames };