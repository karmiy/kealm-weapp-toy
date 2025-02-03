import { Application } from "egg";
import { COUPON_STATUS } from "../utils/constants";
import { CouponModel } from "./coupon";

export interface UserCouponModel {
  id: string;
  user_id: string;
  group_id: string;
  coupon_id: string;
  create_time: Date;
  last_modified_time: Date;
  status: COUPON_STATUS;
  is_deleted: number;
}

export interface UserCouponWithCouponModel extends UserCouponModel {
  coupon: CouponModel;
}

export default (app: Application) => {
  const { INTEGER, DATE, ENUM, TINYINT } = app.Sequelize;

  const UserCoupon = app.model.define("user_coupon", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
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
    coupon_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("coupon_id")); // 访问时自动转为字符串
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
    status: {
      type: ENUM(COUPON_STATUS.ACTIVE, COUPON_STATUS.USED),
      defaultValue: COUPON_STATUS.ACTIVE,
    },
    is_deleted: {
      type: TINYINT,
      defaultValue: 0,
    },
  });

  (UserCoupon as any).associate = function () {
    (app.model.UserCoupon as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.UserCoupon as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
    (app.model.UserCoupon as any).belongsTo(app.model.Coupon, {
      foreignKey: "coupon_id",
      targetKey: "id",
    });
  };

  return UserCoupon;
};
