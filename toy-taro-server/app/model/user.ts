import { Application } from "egg";
import { ROLE } from "../utils/constants";
// import { Model } from 'sequelize';

export interface UserModel {
  id: string;
  username?: string;
  password?: string;
  open_id?: string;
  avatar_url?: string;
  role: ROLE;
  score: number;
  draw_ticket: number;
  create_time: Date;
  last_modified_time: Date;
  group_id: string;
}

export default (app: Application) => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;

  const User = app.model.define("user", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
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
    draw_ticket: {
      type: INTEGER,
      defaultValue: 0, // 默认积分为 0
    },
    create_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"), // 自动生成当前时间戳
      // get() {
      //   const rawValue = (this as any).getDataValue("create_time") as Date;
      //   console.log("[test] create_time", rawValue);
      //   return rawValue ? rawValue.getTime() : null; // 转为时间戳
      // },
    },
    last_modified_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"), // 自动生成当前时间戳
      // get() {
      //   const rawValue = (this as any).getDataValue(
      //     "last_modified_time"
      //   ) as Date;
      //   return rawValue ? rawValue.getTime() : null; // 转为时间戳
      // },
    },
    group_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("group_id")); // 访问时自动转为字符串
      },
    },
  });

  (User as any).associate = function () {
    (app.model.User as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
  };

  return User;
};
