import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
    const config: PowerPartial<EggAppConfig> = {};

    // dev close csrf
    config.security = {
        csrf: {
            enable: false,
        },
    };

    return config;
};
