import { Service } from 'egg';
import { Op } from 'sequelize';
// import { fn, col } from 'sequelize';

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
        account_type_id: number;
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
                    [Op.gte]: ctx.helper.getFirstDayOfMonth(year, month).date,
                    [Op.lte]: ctx.helper.getLastDayOfMonth(year, month).date,
                },
            },
            order: [
                ['create_time', 'desc'],
                ['id', 'desc'],
            ],
            attributes: ['id', 'amount', 'create_time', 'remark'],
            include: {
                attributes: ['id', 'name', 'account_mode'],
                model: app.model.AccountType,
                as: 'account_type',
            },
            limit: page_size,
            offset: (page_no - 1) * page_size,
            // raw: true,
            /* fieldMap: {
                // raw: true 时可映射联合查询的内容
                'account_type.name': 'account_type_name',
                'account_type.account_mode': 'account_mode',
            }, */
        });

        return data as any as Promise<{
            count: number;
            rows: Array<{
                id: number;
                amount: number;
                create_time: number;
                remark?: string;
                account_type: {
                    id: number;
                    name: string;
                    account_mode: number;
                };
            }>;
        }>;
    }

    public async getAccountRecordById(conditions: { id: number; open_id: string }) {
        const { ctx, app } = this;
        const { id, open_id } = conditions;

        const data = await ctx.model.AccountRecord.findByPk(id, {
            attributes: ['id', 'amount', 'create_time', 'remark', 'open_id'],
            include: {
                attributes: ['id', 'name', 'account_mode'],
                model: app.model.AccountType,
                as: 'account_type',
            },
            raw: true,
            nest: true, // include 的结构可以保持，而非扁平
        });

        if (!data) return {};

        const _data = { ...data } as any as {
            id: number;
            amount: number;
            create_time: number;
            remark?: string;
            open_id?: string;
            account_type: {
                id: number;
                name: string;
                account_mode: number;
            };
        };

        if (_data.open_id !== open_id) {
            return Promise.reject(new Error('非法查询'));
        }
        // raw: true 后 Model get 会无效，手动转下
        ctx.helper.hackCreateTime(_data);
        ctx.helper.clearSensitive(_data);

        return _data;
    }

    public async getAmountStatistics(conditions: { year: number; month: number; open_id: string }) {
        const { ctx } = this;
        const { year, month, open_id } = conditions;

        // select date_format(create_time,'%Y%m%d')  as group，sum(amout) as sum from table group by date_format(create_time,'%Y%m%d')
        /* const o = {
            attributes: [fn('date_format', col('create_time'), '%Y-%m-%d')],
            group: fn('date_format', col('create_time'), '%Y-%m-%d'),
            // group: "date_format(`create_time`, '%Y-%m-%d')",
            plain: false,
            // raw: true,
            fieldMap: {
                // raw: true 时可映射联合查询的内容
                "date_format(`create_time`, '%Y-%m-%d')": 'create_time',
            },
            include: {
                model: app.model.AccountType,
                as: 'account_type',
            },
        } as any;
        const data = await ctx.model.AccountRecord.sum('amount', o); */

        interface AccountArr {
            create_time: string;
            income: string;
            expenditure: string;
        }

        const [data = []] = await (ctx.model.query(`SELECT 
        date_format(t.create_time, '%Y-%m-%d') as create_time, 
        sum(case when t.account_mode = 1 then t.amount else 0 end) as 'income',
        -sum(case when t.account_mode = 0 then t.amount else 0 end) as 'expenditure'
        from
        (
            select 
            r.amount,
            r.create_time,
            t.account_mode
            from t_account_record r
            LEFT JOIN t_account_type t on r.account_type_id = t.id 
            WHERE r.create_time >= '${ctx.helper.getFirstDayOfMonth(year, month).dateStr}' 
            AND r.create_time <= '${ctx.helper.getLastDayOfMonth(year, month).dateStr}' 
            AND r.open_id = '${open_id}'
        ) t
        GROUP BY date_format(t.create_time, '%Y-%m-%d');`) as Promise<[AccountArr[], AccountArr]>);

        const groups: Record<string, { income: number; expenditure: number }> = Object.create(null);

        data.forEach(({ create_time, income, expenditure }) => {
            groups[create_time] = {
                income: Number(income),
                expenditure: Number(expenditure),
            };
        });

        return groups;
    }
}
