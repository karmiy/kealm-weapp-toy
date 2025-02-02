import { Application } from "egg";

export interface ProductShopCartModel {
  id: string;
  product_id: string;
  user_id: string;
  create_time: Date;
  last_modified_time: Date;
  quantity: number;
}

export default (app: Application) => {
  const { DATE, INTEGER } = app.Sequelize;

  const ProductShopCart = app.model.define("product_shop_cart", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
    quantity: {
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
    product_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
    user_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
  });

  (ProductShopCart as any).associate = function () {
    (app.model.ProductShopCart as any).belongsTo(app.model.Product, {
      foreignKey: "product_id",
      targetKey: "id",
    });
    (app.model.ProductShopCart as any).belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  return ProductShopCart;
};
