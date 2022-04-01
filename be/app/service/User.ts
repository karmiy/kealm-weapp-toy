import { Service } from 'egg';
import { fn, col } from 'sequelize';
import { startOfDay, differenceInDays } from 'date-fns';

/**
 * User Service
 */
export default class User extends Service {
    /**
     * @description 调用微信官方登录
     * @param code 微信 code
     * @return
     */
    public async wxLogin(code: string) {
        const { app } = this;
        const { AppID, AppSecret } = app;

        const { data, status } = await app.curl<{
            session_key: string;
            openid: string;
            unionid?: string;
            errcode?: number;
            errmsg?: string;
        }>(
            `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`,
            {
                dataType: 'json',
            },
        );

        if (status !== 200) return Promise.reject(new Error('微信登录接口请求失败'));

        const { session_key, openid, errcode, errmsg } = data;

        if (typeof errcode !== 'undefined') {
            return Promise.reject(new Error(errmsg ?? '微信登录过程中发生未知错误'));
        }

        return {
            sessionKey: session_key,
            openId: openid,
        };
    }

    public async getUserAccountStatistics(conditions: { open_id: string }) {
        const { ctx } = this;
        const { open_id } = conditions;

        const data = await ctx.model.AccountRecord.findOne({
            attributes: [
                fn('MIN', col('create_time')),
                fn('MAX', col('create_time')),
                fn('COUNT', '*'),
            ] as any,
            where: {
                open_id,
            },
            fieldMap: {
                'MIN(`create_time`)': 'min_create_time',
                'MAX(`create_time`)': 'max_create_time',
                "COUNT('*')": 'count',
            },
            raw: true,
        });
        const { min_create_time, max_create_time, count } = { ...data } as any as {
            min_create_time: string | null;
            max_create_time: string | null;
            count: number;
        };

        const statistics = {
            usage_days: 0,
            account_days: 0,
            account_count: count,
        };

        if (min_create_time) {
            statistics.usage_days =
                differenceInDays(new Date(), startOfDay(new Date(min_create_time))) + 1;
        }

        if (max_create_time && min_create_time) {
            statistics.account_days =
                differenceInDays(
                    startOfDay(new Date(max_create_time)),
                    startOfDay(new Date(min_create_time)),
                ) + 1;
        }

        return statistics;
    }
}
