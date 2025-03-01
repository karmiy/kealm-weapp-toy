import { Application } from "egg";
import { TASK_TYPE } from "../utils/constants";

export interface TaskModel {
  id: string;
  name: string;
  description: string;
  type: TASK_TYPE;
  prize_id: string;
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
    prize_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("prize_id"));
      },
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
    (app.model.Task as any).belongsTo(app.model.Prize, {
      foreignKey: "prize_id",
      targetKey: "id",
    });
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
