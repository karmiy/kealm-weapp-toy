import { Service } from "egg";
import { Op } from "sequelize";
import { Logger } from "../utils/logger";
import { SERVER_CODE } from "../utils/constants";
import { JsError } from "../utils/error";
import { ProductCategoryModel } from "../model/productCategory";
import { ProductModel } from "../model/product";
import {
  ProductShopCartModel,
  ProductShopCartWithProductModel,
} from "../model/productShopCart";
import { QueryFields, QueryWhere } from "../utils/types";

const logger = Logger.getLogger("[ProductService]");

/**
 * Product Service
 */
export default class Product extends Service {
  async getProductCategoryList() {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();

    // 使用模型获取所有产品类别
    const categories = await ctx.model.ProductCategory.findAll({
      // raw: true,
      where: {
        group_id: groupId,
        is_deleted: 0,
      },
      order: [["last_modified_time", "desc"]],
      // include: [
      //   {
      //     model: ctx.model.Group,
      //     as: "group",
      //     attributes: ["name"],
      //   },
      // ],
    });

    if (!categories) {
      logger.error("[getProductCategoryList] cannot get product category list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return categories as any as ProductCategoryModel[];
  }

  public async findProductCategoryById(
    id: string
  ): Promise<ProductCategoryModel | null> {
    const { ctx } = this;
    const productCategory = await ctx.model.ProductCategory.findByPk(id, {
      // raw: true,
    });
    const model = productCategory as any as ProductCategoryModel;
    if (!model || model?.is_deleted) {
      return null;
    }
    return model;
  }

  public async upsertProductCategory(fields: Partial<ProductCategoryModel>) {
    try {
      const { ctx } = this;
      const { groupId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.ProductCategory.upsert(
        {
          ...ctx.helper.cleanEmptyFields(fields, {
            ignoreList: [undefined],
          }),
          group_id: groupId,
        },
        {
          returning: true,
        }
      );
      const id = (upsertResponse[0] as any).id;
      if (!id) {
        logger
          .tag("[upsertProductCategory]")
          .error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findProductCategoryById(id);
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertProductCategory]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  public async deleteProductCategory(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.ProductCategory.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deleteProductCategory]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  public async findProductById(id: string): Promise<ProductModel | null> {
    const { ctx } = this;
    const product = await ctx.model.Product.findByPk(id, {});
    const model = product as any as ProductModel;
    if (!model || model?.is_deleted) {
      return null;
    }
    return product as any as ProductModel;
  }

  public async upsertProduct(fields: Partial<ProductModel>) {
    try {
      const { ctx } = this;
      const { groupId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.Product.upsert(
        {
          ...fields,
          group_id: groupId,
        },
        {
          returning: true,
        }
      );
      const id = (upsertResponse[0] as any).id;
      if (!id) {
        logger.tag("[upsertProduct]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findProductById(id);
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertProduct]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  public async updateProductsPartial(
    fields: QueryFields<ProductModel>,
    where: QueryWhere<ProductModel>
  ) {
    try {
      const { ctx } = this;
      await ctx.model.Product.update(
        {
          ...fields,
        },
        {
          where: {
            ...where,
          },
          returning: true,
        }
      );
      return Promise.resolve();
    } catch (error) {
      logger.tag("[updateProductsPartial]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, `更新失败`)
      );
    }
  }

  async getProductList(params: { filterEmptyStock?: boolean }) {
    const { filterEmptyStock = false } = params;
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();
    const products = await ctx.model.Product.findAll({
      // raw: true,
      where: {
        group_id: groupId,
        is_deleted: 0,
        ...(filterEmptyStock ? { stock: { [Op.gt]: 0 } } : {}),
      },
      order: [["last_modified_time", "desc"]],
    });

    if (!products) {
      logger.error("[getProductList] cannot get product list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return products as any as ProductModel[];
  }

  public async deleteProduct(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.Product.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deleteProduct]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  public async findProduct(
    fields: Partial<ProductModel>
  ): Promise<ProductModel | null> {
    const { ctx } = this;
    const product = await ctx.model.Product.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      // raw: true,
    });
    return product as any as ProductModel;
  }

  public async findProductShopCart(
    fields: Partial<ProductShopCartModel>
  ): Promise<ProductShopCartModel | null> {
    const { ctx } = this;
    const productShopCart = await ctx.model.ProductShopCart.findOne({
      where: fields,
      // raw: true,
    });
    return productShopCart as any as ProductShopCartModel;
  }

  public async upsertProductShopCart(fields: Partial<ProductShopCartModel>) {
    try {
      const { ctx } = this;
      const { userId, groupId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.ProductShopCart.upsert(
        {
          ...fields,
          user_id: userId,
          group_id: groupId,
        },
        {
          returning: true,
        }
      );
      const id = (upsertResponse[0] as any).id;
      if (!id) {
        logger
          .tag("[upsertProductShopCart]")
          .error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findProductShopCart({
        id,
        user_id: userId,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertProductShopCart]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  public async deleteProductShopCart(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.ProductShopCart.destroy({
        where: { id },
      });
    } catch (error) {
      logger.tag("[deleteProductShopCart]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  public async deleteProductShopCarts(ids: string[]) {
    try {
      const { ctx } = this;
      await ctx.model.ProductShopCart.destroy({
        where: { id: { [Op.in]: ids } },
      });
    } catch (error) {
      logger.tag("[deleteProductShopCart]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  async getProductShopCartList() {
    const { ctx } = this;
    const { userId, groupId } = ctx.getUserInfo();

    const productShopCarts = await ctx.model.ProductShopCart.findAll({
      // raw: true,
      where: {
        user_id: userId,
        group_id: groupId,
      },
      order: [["last_modified_time", "desc"]],
    });

    if (!productShopCarts) {
      logger
        .tag("[getProductShopCartList]")
        .error("cannot get product shop cart list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return productShopCarts as any as ProductShopCartModel[];
  }

  async getProductShopCartListWithProductByIds(ids: string[]) {
    const { ctx } = this;
    const { groupId, userId } = ctx.getUserInfo();

    const productShopCarts = await ctx.model.ProductShopCart.findAll({
      // raw: true,
      where: {
        id: { [Op.in]: ids },
        user_id: userId,
        group_id: groupId,
      },
      order: [["last_modified_time", "desc"]],
      include: [
        {
          model: ctx.model.Product,
          as: "product",
          required: true,
          where: {
            is_deleted: 0,
            group_id: groupId,
          },
        },
      ],
    });

    if (!productShopCarts) {
      logger
        .tag("[getProductShopCartListWithProduct]")
        .error("cannot get product shop cart list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return productShopCarts as any as ProductShopCartWithProductModel[];
  }
}
