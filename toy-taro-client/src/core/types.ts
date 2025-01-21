import type { Config } from './config';

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

export { StoreNamesWithCategoryId, ModelsWithCategoryId };