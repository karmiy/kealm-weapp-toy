import { Controller } from 'egg';
import { ERROR_MESSAGE, RESPONSE_STATUS, SUCCESS_MESSAGE } from '../utils/constants';

export default class AccountController extends Controller {
    public async getTypeList() {
        const { ctx } = this;
        const mode = ctx.getParams('mode');
        const [data, err] = await ctx.helper.asyncWrapper(
            ctx.service.account.getAccountTypeList(mode),
        );

        if (err) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage({ err }),
            };
            return;
        }

        if (!data) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage(),
            };
            return;
        }
        ctx.body = {
            data: {
                list: data,
                size: data.length,
            },
            message: SUCCESS_MESSAGE.请求,
        };
    }

    public async addOrUpdateRecord() {
        const { ctx } = this;
        const { isEmpty } = ctx.helper;
        const { id, amount, account_type, create_time, remark } = ctx.getParams<{
            id?: number;
            amount?: number;
            account_type?: number;
            create_time?: Date;
            remark?: string;
        }>();

        const openId = ctx.getOpenId();

        if (isEmpty(amount) || isEmpty(account_type) || isEmpty(create_time) || isEmpty(openId)) {
            ctx.status = RESPONSE_STATUS.前端错误;
            ctx.body = {
                data: {},
                message: ERROR_MESSAGE.参数,
            };
            return;
        }

        const [data, err] = await ctx.helper.asyncWrapper(
            ctx.service.account.addOrUpdateAccountRecord({
                id,
                amount,
                account_type_id: account_type,
                create_time: new Date(create_time),
                remark,
                open_id: openId,
            }),
        );

        if (err) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage({ err }),
            };
            return;
        }

        if (!data) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage(),
            };
            return;
        }
        ctx.body = {
            data: {},
            message: SUCCESS_MESSAGE.请求,
        };
    }

    public async getRecords() {
        const { ctx } = this;
        const { isEmpty } = ctx.helper;
        const {
            year,
            month,
            page_no,
            page_size = 10,
        } = ctx.getParams<{ year: number; month: number; page_no: number; page_size?: number }>();

        const openId = ctx.getOpenId();

        if (isEmpty(year) || isEmpty(month) || isEmpty(page_no) || isEmpty(openId)) {
            ctx.status = RESPONSE_STATUS.前端错误;
            ctx.body = {
                data: {},
                message: ERROR_MESSAGE.参数,
            };
            return;
        }

        const [data, err] = await ctx.helper.asyncWrapper(
            ctx.service.account.getAccountRecords({
                year,
                month,
                page_no,
                page_size,
                open_id: openId,
            }),
        );

        if (err) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage({ err }),
            };
            return;
        }

        if (!data) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage(),
            };
            return;
        }

        ctx.body = {
            data,
            message: SUCCESS_MESSAGE.请求,
        };
    }

    public async getRecordById() {
        const { ctx } = this;
        const { isEmpty } = ctx.helper;
        const { id } = ctx.getParams<{ id: number }>();

        const openId = ctx.getOpenId();

        if (isEmpty(id) || isEmpty(openId)) {
            ctx.status = RESPONSE_STATUS.前端错误;
            ctx.body = {
                data: {},
                message: ERROR_MESSAGE.参数,
            };
            return;
        }

        const [data, err] = await ctx.helper.asyncWrapper(
            ctx.service.account.getAccountRecordById({
                id,
                open_id: openId,
            }),
        );

        if (err) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage({ err }),
            };
            return;
        }

        if (!data) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage(),
            };
            return;
        }

        ctx.body = {
            data,
            message: SUCCESS_MESSAGE.请求,
        };
    }

    public async getStatistics() {
        const { ctx } = this;
        const { isEmpty } = ctx.helper;
        const { year, month } = ctx.getParams<{ year: number; month: number }>();

        const openId = ctx.getOpenId();

        if (isEmpty(year) || isEmpty(month) || isEmpty(openId)) {
            ctx.status = RESPONSE_STATUS.前端错误;
            ctx.body = {
                data: {},
                message: ERROR_MESSAGE.参数,
            };
            return;
        }

        const [data, err] = await ctx.helper.asyncWrapper(
            ctx.service.account.getAmountStatistics({
                year,
                month,
                open_id: openId,
            }),
        );

        if (err) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage({ err }),
            };
            return;
        }

        if (!data) {
            ctx.status = RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: ctx.helper.getErrorMessage(),
            };
            return;
        }

        ctx.body = {
            data,
            message: SUCCESS_MESSAGE.请求,
        };
    }
}
