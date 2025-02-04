import { Application } from "egg";

export interface UserCheckInRuleModel {
  id: string;
  rule_id: string;
  group_id: string;
  user_id: string;
  create_time: Date;
  last_modified_time: Date;
  is_deleted: number;
}

export default (app: Application) => {
  const { INTEGER, DATE, TINYINT } = app.Sequelize;

  const UserCheckInRule = app.model.define("user_check_in_rule", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
    rule_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("rule_id")); // 访问时自动转为字符串
      },
    },
    group_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("group_id")); // 访问时自动转为字符串
      },
    },
    user_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("user_id")); // 访问时自动转为字符串
      },
    },
    create_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"), // 自动生成当前时间戳
    },
    last_modified_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"), // 自动生成当前时间戳
    },
    is_deleted: {
      type: TINYINT,
      defaultValue: 0,
    },
  });

  (UserCheckInRule as any).associate = function () {
    (app.model.UserCheckInRule as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.UserCheckInRule as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
    (app.model.UserCheckInRule as any).belongsTo(app.model.CheckInRule, {
      foreignKey: "rule_id",
      targetKey: "id",
    });
  };

  return UserCheckInRule;
};
