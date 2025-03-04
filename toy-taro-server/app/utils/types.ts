import { literal, Op } from "sequelize";

export type QueryFields<T> = Partial<{
  [K in keyof T]?: T[K] | ReturnType<typeof literal> | null;
}>;

export type QueryWhere<T> = Partial<{
  [K in keyof T]?:
    | T[K]
    | Array<T[K]>
    | { [Op.in]: Array<T[K]> }
    | { [Op.between]: Array<T[K]> };
}>;
