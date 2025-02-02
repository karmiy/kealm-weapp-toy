import { Service } from "egg";
import { Logger } from "../utils/logger";
import { SERVER_CODE } from "../utils/constants";
import { JsError } from "../utils/error";
import { ProductCategoryModel } from "../model/productCategory";
import { ProductModel } from "../model/product";
import { ProductShopCartModel } from "../model/productShopCart";

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
    return productCategory as any as ProductCategoryModel;
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
      await ctx.model.ProductCategory.destroy({
        where: { id },
      });
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

  async getProductList() {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();

    const products = await ctx.model.Product.findAll({
      // raw: true,
      where: {
        group_id: groupId,
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
      await ctx.model.Product.destroy({
        where: { id },
      });
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
      where: fields,
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
      const { userId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.ProductShopCart.upsert(
        {
          ...fields,
          user_id: userId,
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

  async getProductShopCartList() {
    const { ctx } = this;
    const { userId } = ctx.getUserInfo();

    const productShopCarts = await ctx.model.ProductShopCart.findAll({
      // raw: true,
      where: {
        user_id: userId,
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
}
