import { Application } from "egg";
import { TASK_REWARD_TYPE, TASK_TYPE } from "../utils/constants";

export interface TaskModel {
  id: string;
  name: string;
  description: string;
  type: TASK_TYPE;
  reward_type: TASK_REWARD_TYPE;
  reward_value: number;
  reward_coupon_id?: string | null;
  reward_minimum_order_value?: number | null;
  difficulty: number;
  category_id: string;
  group_id: string;
  user_id: string;
  create_time: Date;
  last_modified_time: Date;
  is_deleted: number;
}

export default (app: Application) => {
  const { STRING, DATE, INTEGER, TEXT, TINYINT, ENUM } = app.Sequelize;

  const Task = app.model.define("task", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id"));
      },
    },
    name: {
      type: STRING(255),
    },
    description: {
      type: TEXT, // 商品描述
    },
    type: {
      type: ENUM(
        TASK_TYPE.DAILY,
        TASK_TYPE.WEEKLY,
        TASK_TYPE.TIMED,
        TASK_TYPE.CHALLENGE
      ),
      defaultValue: TASK_TYPE.DAILY,
    },
    reward_type: {
      type: ENUM(
        TASK_REWARD_TYPE.POINTS,
        TASK_REWARD_TYPE.CASH_DISCOUNT,
        TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT
      ),
      defaultValue: TASK_REWARD_TYPE.POINTS,
    },
    reward_value: {
      type: INTEGER, // 库存数量
    },
    reward_coupon_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("reward_coupon_id"));
      },
    },
    reward_minimum_order_value: {
      type: INTEGER,
    },
    difficulty: {
      type: INTEGER,
    },
    create_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    last_modified_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    category_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("category_id"));
      },
    },
    group_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("group_id"));
      },
    },
    user_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("user_id"));
      },
    },
    is_deleted: {
      type: TINYINT,
      defaultValue: 0,
    },
  });

  (Task as any).associate = function () {
    (app.model.Task as any).belongsTo(app.model.TaskCategory, {
      foreignKey: "category_id",
      targetKey: "id",
    });
    (app.model.Task as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.Task as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  return Task;
};
