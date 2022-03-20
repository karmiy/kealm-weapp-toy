import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },

    mysql: {
        enable: true,
        package: 'egg-mysql',
    },

    jwt: {
        enable: true,
        package: 'egg-jwt',
    },
};

export default plugin;
