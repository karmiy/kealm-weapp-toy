import { Application } from "egg";
import { DISCIPLINE_TYPE } from "../utils/constants";

export interface DisciplineModel {
  id: string;
  user_id: string;
  prize_id: string;
  type: DISCIPLINE_TYPE;
  reason: string;
  operator_id: string;
  create_time: Date;
  last_modified_time: Date;
  group_id: string;
  is_deleted: number;
}

export default (app: Application) => {
  const { INTEGER, TINYINT, DATE, ENUM, TEXT } = app.Sequelize;

  const Discipline = app.model.define("discipline", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      get() {
        return String((this as any).getDataValue("user_id")); // 访问时自动转为字符串
      },
    },
    prize_id: {
      type: INTEGER,
      allowNull: false,
      get() {
        return String((this as any).getDataValue("prize_id")); // 访问时自动转为字符串
      },
    },
    type: {
      type: ENUM(DISCIPLINE_TYPE.PUNISHMENT, DISCIPLINE_TYPE.REWARD),
      allowNull: false,
    },
    reason: {
      type: TEXT,
      allowNull: false,
    },
    operator_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("operator_id")); // 访问时自动转为字符串
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
        return String((this as any).getDataValue("group_id")); // 访问时自动转为字符串
      },
    },
    is_deleted: {
      type: TINYINT,
      defaultValue: 0,
    },
  });

  (Discipline as any).associate = function () {
    (app.model.Discipline as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });

    (app.model.Discipline as any).belongsTo(app.model.User, {
      foreignKey: "operator_id",
      targetKey: "id",
    });

    (app.model.Discipline as any).belongsTo(app.model.Prize, {
      foreignKey: "prize_id",
      targetKey: "id",
    });

    (app.model.Discipline as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
  };

  return Discipline;
};
