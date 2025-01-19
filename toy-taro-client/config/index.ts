import path from 'path';
import { type UserConfigExport, defineConfig } from '@tarojs/cli';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';
import devConfig from './dev';
import prodConfig from './prod';
// const isH5 = process.env.TARO_ENV === "h5";
// const isApp = process.env.TARO_ENV === "rn";
// const WeappTailwindcssDisabled = isH5 || isApp;
export default defineConfig(async (merge, {}) => {
  const baseConfig: UserConfigExport = {
    projectName: 'taro-react-tailwind-vscode-template',
    date: '2023-5-6',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false,
      },
    },
    cache: {
      enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      miniCssExtractPluginOption: {
        // 忽略 mini-css-extract-plugin 的顺序
        // 默认情况下，mini-css-extract-plugin 会根据 CSS 文件的顺序来生成 CSS 文件，
        // 但如 home 页面是顶层先引入了 StatusView，子组件又引入 AtToast，有的页面同时引入，代码书写 AtToast 又在前面
        // 导致 mini-css-extract-plugin 不知道打出来的样式谁在前谁在后
        // 但本项目可以忽略这个顺序，我们以 css module 为主，不太会存在样式顺序问题
        ignoreOrder: true,
      },
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
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [
                {
                  appType: 'taro',
                  // disabled: WeappTailwindcssDisabled,
                  rem2rpx: true,
                },
              ],
            },
          },
        });
      },
      sassLoaderOption: {
        sassOptions: {
          silenceDeprecations: ['legacy-js-api', 'import'],
        },
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js',
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
      },
      esnextModules: ['taro-ui'],
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
      '@ui': path.resolve(__dirname, '..', 'src/ui'),
      '@core': path.resolve(__dirname, '..', 'src/core'),
      '@shared': path.resolve(__dirname, '..', 'src/shared'),
    },
    sass: {
      resource: path.resolve(__dirname, '..', 'src/ui/styles/theme.scss'), // 使用 babel-plugin-import 后需要改为再此引入 theme，否则无效
    },
  };
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
