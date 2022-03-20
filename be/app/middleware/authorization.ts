import { Context, EggAppConfig } from 'egg';

interface VerifyError {
    name: string;
    message: string;
    expiredAt: Date;
}

export default function AuthorizationMiddleware(options: EggAppConfig) {
    const { ignorePaths = [] } = options;

    return async (ctx: Context, next: () => Promise<any>) => {
        const auth = ctx.get('Authorization');
        const path = ctx.path;

        if (ignorePaths.includes(path)) {
            await next();
            return;
        }

        try {
            ctx.app.jwt.verify(auth ?? '', ctx.app.AppSecret);
        } catch (_error) {
            const error = _error as VerifyError;
            if (error.name === 'TokenExpiredError') {
                ctx.status = ctx.helper.RESPONSE_STATUS['Token 失效'];
                ctx.body = {
                    data: {},
                    message: 'token 过期',
                };
                return;
            }
            ctx.status = ctx.helper.RESPONSE_STATUS['Token 失效'];
            ctx.body = {
                data: {},
                message: 'token 失效',
            };
            return;
        }
        await next();
    };
}
