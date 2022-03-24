import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },

    /* mysql: {
        enable: true,
        package: 'egg-mysql',
    }, */

    mysql: {
        enable: true,
        package: 'egg-sequelize',
    },

    jwt: {
        enable: true,
        package: 'egg-jwt',
    },
};

export default plugin;
