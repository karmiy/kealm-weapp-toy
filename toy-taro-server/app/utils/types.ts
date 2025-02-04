import { literal } from "sequelize";

export type QueryFields<T> = Partial<{
  [K in keyof T]?: T[K] | ReturnType<typeof literal>;
}>;

export type QueryWhere<T> = Partial<{
  [K in keyof T]?: T[K] | Array<T[K]>;
}>;
