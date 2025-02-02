import { EggPlugin } from "egg";

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
    package: "egg-sequelize",
  },

  jwt: {
    enable: true,
    package: "egg-jwt",
  },

  // multipart: { // 不需要配了，eggJS 在当前版本自带
  //   enable: true,
  //   package: "egg-multipart",
  // },
};

export default plugin;
