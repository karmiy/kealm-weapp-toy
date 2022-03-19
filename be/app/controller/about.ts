import { Controller } from 'egg';

function sleep(delay = 1000): Promise<void> {
    return new Promise(r => {
        setTimeout(r, delay);
    });
}

export default class AboutController extends Controller {
    public async index() {
        const { ctx } = this;
        const text = await ctx.service.test.sayHi('about');
        await sleep();
        ctx.body = text;
    }

    public async getUser() {
        const { ctx } = this;
        ctx.body = { ...ctx.query, id: ctx.params.id };
    }

    public async addUser() {
        const { ctx } = this;

        ctx.body = {
            status: 200,
            data: ctx.request.body,
        };
    }
}
