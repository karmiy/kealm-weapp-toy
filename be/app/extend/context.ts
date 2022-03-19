import { Context, PlainObject } from 'egg';

function getParams(this: Context): PlainObject<string> | undefined;
function getParams(this: Context, key: string): string | undefined;
function getParams(this: Context, key?: string) {
    const { method } = this.request;

    switch (method) {
        case 'GET':
            return key ? this.query[key] : this.query;
        case 'POST':
            return key ? this.request.body[key] : this.request.body;
        default:
            return;
    }
}

export default {
    getParams,
};
