import { Application } from "egg";

export interface GroupModel {
  id: string;
  name: string;
  create_time: Date;
}

export default (app: Application) => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const Group = app.model.define("group", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        // 不能配置 raw: true，否则会不触发 get
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
    name: {
      type: STRING(255),
      unique: true,
    },
    create_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return Group;
};
