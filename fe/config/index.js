const path = require('path');

const SPLIT_CHUNKS = {
    TARO_ECHARTS_REACT: 'pages/chart/taro3-echarts-react', // 需要 pages/chart/ 前缀，为了使 splitChunk 后放到子包文件夹里，小程序才会识别为子包一员
};

const config = {
    projectName: 'fe',
    date: '2022-3-17',
    designWidth: 750,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
        [
            'taro-plugin-tailwind',
            {
                scan: {
                    dirs: ['./src'], // 只扫描 src 目录下的文件
                    exclude: ['dist/**/*'], // 排除 dist 目录
                },
                // 具体参数见：https://github.com/windicss/vite-plugin-windicss/blob/main/packages/plugin-utils/src/options.ts#L10
            },
        ],
    ],
    defineConstants: {},
    copy: {
        patterns: [],
        options: {},
    },
    framework: 'react',
    mini: {
        postcss: {
            pxtransform: {
                enable: true,
                config: {},
            },
            url: {
                enable: true,
                config: {
                    limit: 1024, // 设定转换尺寸上限
                },
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]',
                },
            },
        },
        webpackChain(chain) {
            chain
                .plugin('analyzer')

                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, []);

            // chain.optimization.sideEffects(false);
            chain.merge({
                optimization: {
                    splitChunks: {
                        cacheGroups: {
                            [SPLIT_CHUNKS.TARO_ECHARTS_REACT]: {
                                name: SPLIT_CHUNKS.TARO_ECHARTS_REACT,
                                // minChunks: 2,
                                test: module => {
                                    return /node_modules[\\/]taro3-echarts-react/.test(
                                        module.resource,
                                    );
                                },
                                priority: 200,
                            },
                        },
                    },
                },
            });
        },
        addChunkPages(pages) {
            pages.set('pages/chart/index', [SPLIT_CHUNKS.TARO_ECHARTS_REACT]);
        },
    },
    h5: {
        publicPath: '/',
        staticDirectory: 'static',
        postcss: {
            autoprefixer: {
                enable: true,
                config: {},
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]',
                },
            },
        },
        esnextModules: ['taro-ui'],
    },
    alias: {
        '@': path.resolve(__dirname, '..', 'src'),
    },
};

module.exports = function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, require('./dev'));
    }
    return merge({}, config, require('./prod'));
};
