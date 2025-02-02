import { Application } from "egg";

export interface ProductCategoryModel {
  id: string;
  name: string;
  group_id: string;
  create_time: Date;
  last_modified_time: Date;
}

export default (app: Application) => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const ProductCategory = app.model.define("product_category", {
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
      unique: true,
    },
    create_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
      // defaultValue: new Date(),
    },
    last_modified_time: {
      type: DATE,
      defaultValue: app.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    group_id: {
      type: INTEGER,
      get() {
        return String((this as any).getDataValue("id")); // 访问时自动转为字符串
      },
    },
  });

  (ProductCategory as any).associate = function () {
    (app.model.ProductCategory as any).belongsTo(app.model.Group, {
      foreignKey: "group_id",
      targetKey: "id",
    });
  };

  return ProductCategory;
};
