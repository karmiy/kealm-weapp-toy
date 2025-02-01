import { Application } from "egg";
// import { Model } from 'sequelize';

export default (app: Application) => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;

  const User = app.model.define("user", {
    username: {
      type: STRING(255),
      allowNull: true,
      unique: true,
    },
    password: {
      type: STRING(255),
      allowNull: true,
    },
    open_id: {
      type: STRING(255),
      allowNull: true,
      unique: true,
    },
    avatar_url: {
      type: STRING(255),
      allowNull: true, // 头像可选
    },
    role: {
      type: ENUM("ADMIN", "USER"),
      defaultValue: "USER", // 默认是普通用户
    },
    score: {
      type: INTEGER,
      defaultValue: 0, // 默认积分为 0
    },
    create_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"), // 自动生成当前时间戳
      get() {
        const rawValue = (this as any).getDataValue("create_time") as Date;
        console.log("[test] create_time", rawValue);
        return rawValue ? rawValue.getTime() : null; // 转为时间戳
      },
    },
    last_modified_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"), // 自动生成当前时间戳
      get() {
        const rawValue = (this as any).getDataValue(
          "last_modified_time"
        ) as Date;
        return rawValue ? rawValue.getTime() : null; // 转为时间戳
      },
    },
  });

  return User;
};
