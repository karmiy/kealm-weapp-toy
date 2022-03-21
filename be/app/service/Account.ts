import { Service } from 'egg';

/**
 * Account Service
 */
export default class Account extends Service {
    /**
     * @description 查询分类列表
     */
    public async getAccountTypeList(mode?: string) {
        const { ctx, app } = this;

        const accountModeCondition = !ctx.helper.isEmpty(mode) ? { account_mode: mode } : {};

        return app.mysql.select('t_account_type', {
            where: { ...accountModeCondition },
            columns: ['id', 'name', 'account_mode'],
            orders: [['id', 'asc']],
        }) as Promise<Array<Model.AccountType>>;
    }

    public async addOrUpdateAccountRecord(record: PickPartial<Model.AccountRecord, 'id'>) {
        const { ctx, app } = this;
        const { id, ...restProps } = record;

        return ctx.helper.isEmpty(id)
            ? app.mysql.insert('t_account_record', { ...restProps })
            : app.mysql.update('t_account_record', { ...restProps });
    }
}
