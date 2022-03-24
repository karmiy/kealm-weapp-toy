import { Controller } from 'egg';

export default class UserController extends Controller {
    public async login() {
        const { ctx, app } = this;
        const { AppSecret } = app;
        const code = ctx.getParams('code');

        if (!code) {
            ctx.status = ctx.helper.RESPONSE_STATUS.前端错误;
            ctx.body = {
                data: {},
                message: 'code 参数错误',
            };
            return;
        }

        const [data, err] = await ctx.helper.asyncWrapper(ctx.service.user.wxLogin(code));

        if (err) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: err.res?.message,
            };
            return;
        }

        if (!data) {
            ctx.status = ctx.helper.RESPONSE_STATUS.服务端错误;
            ctx.body = {
                data: {},
                message: '微信登录过程中发生未知错误',
            };
            return;
        }

        const token = app.jwt.sign(
            { openId: data.openId, sessionKey: data.sessionKey },
            AppSecret,
            {
                // 以秒表示或描述时间跨度 zeit / ms 的字符串。如 60，"2 days"，"10h"，"7d"，Expiration time，过期时间
                // 如 10 是 10s，'1000' 是 1s
                expiresIn: '2d',
            },
        );

        ctx.status = ctx.helper.RESPONSE_STATUS.成功;
        ctx.body = {
            data: {
                token,
            },
            message: '登录成功',
        };
    }

    public async test() {
        const { ctx, app } = this;
        const token = app.jwt.sign({ openId: 'xxxxaaaasssssddddfff' }, 'karmiy123', {
            expiresIn: 10, // 以秒表示或描述时间跨度zeit / ms的字符串。如60，"2 days"，"10h"，"7d"，Expiration time，过期时间
        });
        console.log(2);

        ctx.body = {
            code: 200,
            data: {
                token,
                now: new Date().toLocaleString(),
            },
            message: '成功',
        };
    }

    public async test2() {
        const { ctx, app } = this;
        const token = ctx.getParams('token');
        // console.log('ctx.headers------------------', ctx.headers);

        try {
            ctx.body = {
                code: 200,
                data: {
                    k: 100,
                    verify: app.jwt.verify(token ?? '', 'karmiy123'),
                    raw: app.jwt.decode(token ?? ''),
                    exp: new Date((app.jwt.decode(token ?? '') as any).exp * 1000).toLocaleString(),
                    now: new Date().toLocaleString(),
                },
                message: '成功',
            };
        } catch (error) {
            ctx.body = {
                code: 200,
                data: {
                    error,
                    raw: app.jwt.decode(token ?? ''),
                    exp: new Date((app.jwt.decode(token ?? '') as any).exp * 1000).toLocaleString(),
                    now: new Date().toLocaleString(),
                },
                message: '成功',
            };
        }
    }
}
