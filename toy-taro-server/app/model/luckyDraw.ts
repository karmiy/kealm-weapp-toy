import { Application } from "egg";
import { LUCKY_DRAW_TYPE } from "../utils/constants";

interface LuckDrawPrize {
  prize_id: string;
  range: number;
}

export interface LuckyDrawModel {
  id: string;
  type: LUCKY_DRAW_TYPE;
  cover_image: string;
  name: string;
  quantity: number;
  list: Array<LuckDrawPrize>;
  create_time: Date;
  last_modified_time: Date;
  group_id: string;
  user_id: string;
  is_deleted: number;
}

export default (app: Application) => {
  const { INTEGER, TINYINT, DATE, ENUM, STRING, JSON } = app.Sequelize;

  const LuckyDraw = app.model.define("lucky_draw", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id"));
      },
    },
    type: {
      type: ENUM(LUCKY_DRAW_TYPE.WHEEL, LUCKY_DRAW_TYPE.GRID),
      allowNull: false,
    },
    cover_image: {
      type: STRING(255),
      allowNull: false,
    },
    name: {
      type: STRING(255),
      allowNull: false,
    },
    quantity: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    list: {
      type: JSON,
      defaultValue: [],
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

  (LuckyDraw as any).associate = function () {
    (app.model.LuckyDraw as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.LuckyDraw as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  return LuckyDraw;
};
