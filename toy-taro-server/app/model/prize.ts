import { Application } from "egg";
import { PRIZE_TYPE } from "../utils/constants";

export interface PrizeModel {
  id: string;
  type: PRIZE_TYPE;
  coupon_id?: string;
  points?: number;
  draw_count?: number;
  text?: string;
  sort_value: number;
  create_time: Date;
  last_modified_time: Date;
  group_id: string;
  user_id: string;
  is_deleted: number;
}

export default (app: Application) => {
  const { DATE, INTEGER, TINYINT, ENUM, STRING } = app.Sequelize;

  const Prize = app.model.define("prize", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id"));
      },
    },
    type: {
      type: ENUM(
        PRIZE_TYPE.POINTS,
        PRIZE_TYPE.COUPON,
        PRIZE_TYPE.LUCKY_DRAW,
        PRIZE_TYPE.NONE
      ),
      defaultValue: PRIZE_TYPE.POINTS,
    },
    coupon_id: {
      type: INTEGER,
      get() {
        const value = (this as any).getDataValue("coupon_id");
        return value ? String(value) : undefined;
      },
    },
    points: {
      type: INTEGER,
    },
    draw_count: {
      type: INTEGER,
    },
    text: {
      type: STRING(255),
    },
    sort_value: {
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

  (Prize as any).associate = function () {
    (app.model.Prize as any).belongsTo(app.model.Coupon, {
      foreignKey: "coupon_id",
      targetKey: "id",
    });
    (app.model.Prize as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.Prize as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  return Prize;
};
