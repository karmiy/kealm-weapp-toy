import { Application } from "egg";

export interface LuckyDrawHistoryModel {
  id: string;
  prize_id: string;
  create_time: Date;
  last_modified_time: Date;
  group_id: string;
  user_id: string;
  is_deleted: number;
}

export default (app: Application) => {
  const { INTEGER, TINYINT, DATE } = app.Sequelize;

  const LuckyDrawHistory = app.model.define("lucky_draw_history", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id"));
      },
    },
    prize_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("prize_id"));
      },
    },
    create_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    last_modified_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
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

  (LuckyDrawHistory as any).associate = function () {
    (app.model.LuckyDrawHistory as any).belongsTo(app.model.Prize, {
      foreignKey: "prize_id",
      targetKey: "id",
    });
    (app.model.LuckyDrawHistory as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.LuckyDrawHistory as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  return LuckyDrawHistory;
};
