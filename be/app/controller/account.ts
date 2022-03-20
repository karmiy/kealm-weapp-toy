import { Controller } from 'egg';

export default class AccountController extends Controller {
    public async getTypeList() {
        const { ctx } = this;
        const mode = ctx.getParams('mode');
        const [data, err] = await ctx.helper.asyncWrapper(
            ctx.service.account.getAccountTypeList(mode),
        );

        if (err) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: '请求过程中发生位置错误',
            };
            return;
        }

        if (!data) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: '请求过程中发生位置错误',
            };
            return;
        }
        ctx.body = {
            data,
        };
    }
}
