import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1642605165960_475';

    // add your egg config in here
    config.middleware = ['guardParams', 'authorization'];

    // add your special config in here
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    };

    /* config.mysql = {
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
        // 单数据库信息配置
        client: {
            // host
            host: 'localhost',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: 'karmiy@123',
            // 数据库名
            database: 'weapp-accounts',
        },
    }; */

    config.sequelize = {
        dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
        database: 'weapp-accounts',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'karmiy@123',
        define: {
            freezeTableName: true,
            timestamps: false,
        },
        timezone: '+8:00',
    };

    config.authorization = {
        // 忽略的 path
        ignorePaths: ['/v1/accounts/user/login'],
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
