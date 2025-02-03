import { Application } from "egg";

export interface ProductModel {
  id: string;
  name: string;
  description?: string;
  discounted_score?: number; // 优惠价
  original_score: number; // 原价
  stock: number; // 库存数量
  cover_image: string; // 封面图
  create_time: Date; // 创建时间
  last_modified_time: Date;
  flash_sale_start?: Date | null; // 限时特惠开始时间
  flash_sale_end?: Date | null; // 限时特惠结束时间
  category_id: string;
  group_id: string;
  is_deleted: number;
}

export default (app: Application) => {
  const { STRING, DATE, INTEGER, TEXT, DECIMAL, TINYINT } = app.Sequelize;

  const Product = app.model.define("product", {
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
    description: {
      type: TEXT, // 商品描述
    },
    discounted_score: {
      type: DECIMAL(10, 2), // 优惠价
    },
    original_score: {
      type: DECIMAL(10, 2), // 原价
    },
    stock: {
      type: INTEGER, // 库存数量
    },
    cover_image: {
      type: STRING(255), // 商品封面图
    },
    create_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    last_modified_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    flash_sale_start: {
      type: DATE,
    },
    flash_sale_end: {
      type: DATE,
    },
    category_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("category_id")); // 访问时自动转为字符串
      },
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

  (Product as any).associate = function () {
    (app.model.Product as any).belongsTo(app.model.ProductCategory, {
      foreignKey: "category_id",
      targetKey: "id",
    });
    (app.model.Product as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
  };

  return Product;
};
