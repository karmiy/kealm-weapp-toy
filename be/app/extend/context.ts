import { Context } from 'egg';

function getParams<T>(this: Context): T;
function getParams<T = string>(this: Context, key: string): T | undefined;
function getParams<T>(this: Context, key?: string): T | undefined {
    const { method } = this.request;

    switch (method) {
        case 'GET':
            if (key) return this.query[key] as any as T;

            return (this.query ?? {}) as any as T;
        case 'POST':
            if (key) return this.request.body[key] as any as T;

            return (this.request.body ?? {}) as any as T;
        default:
            return;
    }
}

export default {
    getParams,
    getOpenId(this: Context) {
        const auth = this.get('Authorization');

        const payload = this.app.jwt.decode(auth) as any as {
            openId?: string;
            sessionKey?: string;
        };

        return payload.openId;
    },
};
