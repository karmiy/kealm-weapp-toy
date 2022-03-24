import { Service } from 'egg';
import { Op } from 'sequelize';
import { set, lastDayOfMonth } from 'date-fns';

/**
 * Account Service
 */
export default class Account extends Service {
    /**
     * @description 查询分类列表
     */
    public async getAccountTypeList(mode?: string) {
        const { ctx } = this;

        const accountModeCondition = !ctx.helper.isEmpty(mode) ? { account_mode: mode } : {};

        const list = await ctx.model.AccountType.findAll({
            where: accountModeCondition,
            order: [['id', 'asc']],
            // attributes: ['id', 'name', 'accountMode'],
            attributes: ['id', 'name', 'account_mode'],
            raw: true,
        });
        return list as any as Promise<Array<{ id: number; name: string; account_mode: number }>>;
        /* return app.mysql.select('t_account_type', {
            where: { ...accountModeCondition },
            columns: ['id', 'name', 'account_mode'],
            orders: [['id', 'asc']],
        }) as Promise<Array<Model.AccountType>>; */
    }

    public async addOrUpdateAccountRecord(record: {
        id?: number;
        amount: number;
        account_type: number;
        create_time: Date;
        remark?: string;
        open_id: string;
    }) {
        const { ctx } = this;
        const { id, ...restProps } = record;

        return ctx.helper.isEmpty(id)
            ? ctx.model.AccountRecord.create({
                  ...restProps,
              })
            : ctx.model.AccountRecord.update(
                  {
                      ...restProps,
                  },
                  {
                      where: {
                          id,
                      },
                      returning: true,
                  },
              );
        // return ctx.helper.isEmpty(id)
        //     ? app.mysql.insert('t_account_record', { ...restProps })
        //     : app.mysql.update('t_account_record', { ...restProps });
    }

    public async getAccountRecords(conditions: {
        year: number;
        month: number;
        page_no: number;
        page_size: number;
        open_id: string;
    }) {
        const { ctx, app } = this;
        // const { year, month, page_no, page_size, open_id } = conditions;
        const { year, month, page_no, page_size, open_id } = conditions;

        const data = await ctx.model.AccountRecord.findAndCountAll({
            where: {
                open_id,
                create_time: {
                    [Op.gte]: set(new Date(), {
                        year,
                        month: month - 1,
                        date: 1,
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                    }),
                    [Op.lte]: set(lastDayOfMonth(new Date(year, month - 1)), {
                        hours: 23,
                        minutes: 59,
                        seconds: 59,
                    }),
                },
            },
            attributes: ['id', 'amount', 'account_type_id', 'create_time', 'remark'],
            include: {
                attributes: ['name', 'account_mode'],
                model: app.model.AccountType,
            },
            limit: page_size,
            offset: (page_no - 1) * page_size,
            raw: true,
            fieldMap: {
                't_account_type.name': 'account_type_name',
                't_account_type.account_mode': 'account_mode',
            },
        });

        return data as any as Promise<{
            count: number;
            rows: Array<{
                id: number;
                amount: number;
                account_type_id: number;
                create_time: Date;
                remark?: string;
                account_type_name: string;
                account_mode: number;
            }>;
        }>;
    }
}
