import { Context } from 'egg';

export default function GuardParamsMiddleware() {
    return async (ctx: Context, next: () => Promise<any>) => {
        const { query } = ctx;
        // 前端传 undefined 时，会接收到 'undefined' 字符串，这里拦截过滤
        if (query) {
            for (const key in query) {
                if (query[key] === 'undefined') delete query[key];
            }
        }
        await next();
    };
}
