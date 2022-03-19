import { Application } from 'egg';

const getPath = (path: string) => `/v1/accounts${path}`;

export default (app: Application) => {
    const { controller, router } = app;

    // const counterMiddleware = middleware.counter();

    // router.get(getPath('/about'), counterMiddleware, controller.about.index);
    router.get(getPath('/about'), controller.about.index);
};
