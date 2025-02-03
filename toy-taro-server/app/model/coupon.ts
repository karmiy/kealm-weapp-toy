import { Application } from "egg";
import { COUPON_TYPE, COUPON_VALIDITY_TIME_TYPE } from "../utils/constants";
// import { Model } from 'sequelize';

export interface CouponModel {
  id: string;
  name: string;
  group_id: string;
  user_id: string;
  create_time: Date;
  last_modified_time: Date;
  type: COUPON_TYPE;
  value: number;
  minimum_order_value: number;
  validity_time_type: COUPON_VALIDITY_TIME_TYPE;
  start_time?: number | null;
  end_time?: number | null;
  dates?: number[] | null;
  days?: number[] | null;
  is_deleted: number;
}

export default (app: Application) => {
  const { STRING, INTEGER, DATE, ENUM, BIGINT, JSON, TINYINT } = app.Sequelize;

  const Coupon = app.model.define("coupon", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
    name: {
      type: STRING(255),
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
    type: {
      type: ENUM(COUPON_TYPE.CASH_DISCOUNT, COUPON_TYPE.PERCENTAGE_DISCOUNT),
      defaultValue: COUPON_TYPE.CASH_DISCOUNT,
    },
    value: {
      type: INTEGER,
    },
    minimum_order_value: {
      type: INTEGER,
    },
    validity_time_type: {
      type: ENUM(
        COUPON_VALIDITY_TIME_TYPE.DATE_RANGE,
        COUPON_VALIDITY_TIME_TYPE.DATE_LIST,
        COUPON_VALIDITY_TIME_TYPE.WEEKLY
      ),
      defaultValue: COUPON_VALIDITY_TIME_TYPE.DATE_RANGE,
    },
    start_time: {
      type: BIGINT,
    },
    end_time: {
      type: BIGINT,
    },
    dates: {
      type: JSON,
    },
    days: {
      type: JSON,
    },
    is_deleted: {
      type: TINYINT,
      defaultValue: 0,
    },
  });

  (Coupon as any).associate = function () {
    (app.model.Coupon as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.Coupon as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  return Coupon;
};
