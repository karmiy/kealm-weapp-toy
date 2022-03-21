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
                message: '请求过程中发生未知错误',
            };
            return;
        }

        if (!data) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: '请求过程中发生未知错误',
            };
            return;
        }
        ctx.body = {
            data: {
                list: data,
                size: data.length,
            },
            message: '获取成功',
        };
    }

    public async addOrUpdateRecord() {
        const { ctx } = this;
        const { isEmpty } = ctx.helper;
        const { id, amount, account_type, create_time, remark } =
            ctx.getParams<Partial<Model.AccountRecord>>();

        const openId = ctx.getOpenId();

        if (isEmpty(amount) || isEmpty(account_type) || isEmpty(create_time) || isEmpty(openId)) {
            ctx.status = ctx.helper.RESPONSE_STATUS.前端错误;
            ctx.body = {
                data: {},
                message: '参数错误',
            };
            return;
        }

        const [data, err] = await ctx.helper.asyncWrapper(
            ctx.service.account.addOrUpdateAccountRecord({
                id,
                amount,
                account_type,
                create_time: new Date(create_time),
                remark,
                open_id: openId,
            }),
        );

        if (err) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: '请求过程中发生未知错误',
            };
            return;
        }

        if (!data) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: '请求过程中发生未知错误',
            };
            return;
        }
        ctx.body = {
            data: {},
            message: '获取成功',
        };

        /* const [data, err] = await ctx.helper.asyncWrapper(
            ctx.service.account.getAccountTypeList(mode),
        );

        if (err) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: '请求过程中发生未知错误',
            };
            return;
        }

        if (!data) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: '请求过程中发生未知错误',
            };
            return;
        }
        ctx.body = {
            data: {
                list: data,
                size: data.length,
            },
            message: '获取成功',
        }; */
    }
}
