/* 全局声明类型 */
import 'egg';
import { Application } from 'egg';

interface Result {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    serverStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
}

type Row = Record<string, any>;
type Options = Record<string, any>;

declare module 'egg' {
    interface Application {
        mysql: {
            select: <T>(tableName: string, options?: Options) => Promise<T>;
            get: <T>(tableName: string, row: Row) => Promise<T>;
            insert: (tableName: string, row: Row) => Promise<Result>;
            update: (tableName: string, row: Row, options?: Options) => Promise<Result>;
            delete: (tableName: string, row: Row) => Promise<Result>;
        };
    }
}