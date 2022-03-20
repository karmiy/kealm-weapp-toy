import { Service } from 'egg';

interface AccountType {
    id: number;
    name: string;
    account_mode: number;
    open_id: number;
}

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
        }) as Promise<Array<AccountType>>;
    }
}
