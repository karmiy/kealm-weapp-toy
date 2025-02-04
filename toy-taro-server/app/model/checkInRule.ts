import { Application } from "egg";
import {
  CHECK_IN_RULE_REWARD_TYPE,
  CHECK_IN_RULE_TYPE,
} from "../utils/constants";

export interface CheckInRuleModel {
  id: string;
  type: CHECK_IN_RULE_TYPE;
  value: number;
  reward_type: CHECK_IN_RULE_REWARD_TYPE;
  reward_value: number;
  group_id: string;
  user_id: string;
  create_time: Date;
  last_modified_time: Date;
  is_deleted: number;
}

export default (app: Application) => {
  const { INTEGER, DATE, ENUM, TINYINT } = app.Sequelize;

  const CheckInRule = app.model.define("check_in_rule", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
    type: {
      type: ENUM(CHECK_IN_RULE_TYPE.CUMULATIVE, CHECK_IN_RULE_TYPE.STREAK),
      defaultValue: CHECK_IN_RULE_TYPE.CUMULATIVE,
    },
    value: {
      type: INTEGER,
    },
    reward_type: {
      type: ENUM(CHECK_IN_RULE_REWARD_TYPE.POINTS),
      defaultValue: CHECK_IN_RULE_REWARD_TYPE.POINTS,
    },
    reward_value: {
      type: INTEGER,
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

  (CheckInRule as any).associate = function () {
    (app.model.CheckInRule as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.CheckInRule as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  return CheckInRule;
};
