import { Application } from "egg";
import { PRODUCT_ORDER_STATUS } from "../utils/constants";

export interface ProductOrderModel {
  id: string;
  products: Array<{
    id: string;
    name: string;
    description: string;
    count: number;
    cover_image: string;
  }>;
  coupon_id?: string;
  score: number;
  discount_score?: number;
  status: PRODUCT_ORDER_STATUS;
  create_time: Date;
  last_modified_time: Date;
  group_id: string;
  user_id: string;
  is_deleted: number;
}

export default (app: Application) => {
  const { STRING, DATE, INTEGER, TINYINT, ENUM, JSON } = app.Sequelize;

  const ProductOrder = app.model.define("product_order", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id"));
      },
    },
    products: {
      type: JSON,
    },
    coupon_id: {
      type: STRING(255),
    },
    score: {
      type: INTEGER,
    },
    discount_score: {
      type: INTEGER,
    },
    status: {
      type: ENUM(
        PRODUCT_ORDER_STATUS.INITIAL,
        PRODUCT_ORDER_STATUS.REVOKING,
        PRODUCT_ORDER_STATUS.APPROVED,
        PRODUCT_ORDER_STATUS.REJECTED
      ),
      defaultValue: PRODUCT_ORDER_STATUS.INITIAL,
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

  (ProductOrder as any).associate = function () {
    (app.model.ProductOrder as any).belongsTo(app.model.UserCoupon, {
      foreignKey: "coupon_id",
      targetKey: "id",
    });
    (app.model.ProductOrder as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
    (app.model.ProductOrder as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  return ProductOrder;
};
