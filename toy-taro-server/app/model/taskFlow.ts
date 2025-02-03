import { Application } from "egg";
import { TASK_STATUS } from "../utils/constants";

export interface TaskFlowModel {
  id: string;
  status: TASK_STATUS;
  task_id: string;
  user_id: string;
  group_id: string;
  create_time: Date;
  last_modified_time: Date;
  is_deleted: number;
}

export default (app: Application) => {
  const { INTEGER, DATE, ENUM, TINYINT } = app.Sequelize;

  const TaskFlow = app.model.define("task_flow", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
    status: {
      type: ENUM(
        TASK_STATUS.PENDING_APPROVAL,
        TASK_STATUS.APPROVED,
        TASK_STATUS.REJECTED
      ),
      defaultValue: TASK_STATUS.PENDING_APPROVAL,
    },
    task_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("task_id")); // 访问时自动转为字符串
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

  (TaskFlow as any).associate = function () {
    (app.model.TaskFlow as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.TaskFlow as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
    (app.model.TaskFlow as any).belongsTo(app.model.Task, {
      foreignKey: "task_id",
      targetKey: "id",
    });
  };

  return TaskFlow;
};
