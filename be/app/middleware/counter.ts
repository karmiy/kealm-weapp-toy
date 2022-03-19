import { Context } from 'egg';

// export default function CounterMiddleware(options: EggAppConfig, app: Application) {
export default function CounterMiddleware() {
    //   console.log(options, app);
    return async (ctx: Context, next: () => Promise<any>) => {
        console.log('CounterMiddleware------------------------------', ctx);
        await next();
    };
}
