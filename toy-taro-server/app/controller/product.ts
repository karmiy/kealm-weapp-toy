import { Controller } from "egg";
import { startOfDay, endOfDay } from "date-fns";
import { Logger } from "../utils/logger";
import {
  ProductCategoryEntity,
  ProductEntity,
  ProductShopCartEntity,
} from "../entity/product";
import { FILE_PREFIX, FILE_SCORE, SERVER_CODE } from "../utils/constants";
import { ProductModel } from "../model/product";
import { ProductShopCartModel } from "../model/productShopCart";

const logger = Logger.getLogger("[ProductController]");

export default class ProductController extends Controller {
  public async getProductCategoryList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.product.getProductCategoryList();

      const categoryList: ProductCategoryEntity[] = list.map((item) => {
        const { id, name, create_time, last_modified_time } = item;
        return {
          id,
          name,
          create_time: create_time.getTime(),
          last_modified_time: last_modified_time.getTime(),
        };
      });
      logger.tag("[getProductCategoryList]").info("list", categoryList);

      ctx.responseSuccess({
        data: categoryList,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async updateProductCategory() {
    const { ctx } = this;
    try {
      const { id, name } = ctx.getParams<{ id?: string; name: string }>();

      if (!name) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少分类名称",
        });
        return;
      }

      if (id) {
        const model = await ctx.service.product.findProductCategoryById(id);
        if (!model) {
          ctx.responseFail({
            code: SERVER_CODE.BAD_REQUEST,
            message: "分类不存在",
          });
          return;
        }
      }

      const data = await ctx.service.product.upsertProductCategory({
        id,
        name,
      });

      if (!data) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取分类异常",
        });
        return;
      }

      const entity: ProductCategoryEntity = {
        id: data.id,
        name: data.name,
        create_time: data.create_time.getTime(),
        last_modified_time: data.last_modified_time.getTime(),
      };

      ctx.responseSuccess({
        data: entity,
        message: `${id ? "更新" : "创建"}成功`,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async deleteProductCategory() {
    const { ctx } = this;
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少分类 id",
        });
        return;
      }
      const productCategoryModel =
        await ctx.service.product.findProductCategoryById(id);

      if (!productCategoryModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "分类不存在",
        });
        return;
      }
      const productModel = await ctx.service.product.findProduct({
        category_id: id,
      });
      if (productModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "无法删除，分类下存在商品",
        });
        return;
      }
      await ctx.service.product.deleteProductCategory(id);
      ctx.responseSuccess({
        message: "删除成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  private _productModelToEntity(model: ProductModel) {
    const { ctx } = this;
    const entity: ProductEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        name: model.name,
        desc: model.description ?? "",
        discounted_score: model.discounted_score,
        original_score: model.original_score,
        stock: model.stock,
        cover_image: model.cover_image,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
        flash_sale_start: model.flash_sale_start?.getTime(),
        flash_sale_end: model.flash_sale_end?.getTime(),
        category_id: model.category_id,
      },
      {
        ignoreList: [0, undefined],
      }
    );

    return entity;
  }

  public async updateProduct() {
    const { ctx, app } = this;
    const { userId } = ctx.getUserInfo();
    try {
      const params = ctx.getParams<{
        id?: string;
        name: string;
        desc?: string;
        discounted_score?: string;
        original_score: string;
        stock: string;
        // cover_image: string;
        category_id: string;
        flash_sale_start?: string;
        flash_sale_end?: string;
      }>();

      const {
        id,
        name,
        desc,
        discounted_score = "",
        original_score,
        stock,
        category_id,
        flash_sale_start = "",
        flash_sale_end = "",
      } = params;
      const file = ctx.request.files[0];
      const discountedScore = Number(discounted_score);

      logger.tag("[updateProduct]").info(params);

      if (!id && !file) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品封面图不能为空",
        });
        return;
      }
      if (!name) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品名称不能为空",
        });
        return;
      }

      if (!original_score) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品积分不能为空",
        });
        return;
      }

      if (!stock) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品库存不能为空",
        });
        return;
      }

      if (!category_id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品分类不能为空",
        });
        return;
      }

      if (discountedScore && (!flash_sale_start || !flash_sale_end)) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "特惠时间不能为空",
        });
        return;
      }

      const fileData = file
        ? await app.uploadFile({
            file,
            prefix: FILE_PREFIX.PRODUCT_COVER,
            userId,
            score: FILE_SCORE.IMAGES,
          })
        : null;

      const prevProductModel = id
        ? await ctx.service.product.findProductById(id)
        : null;
      if (id && !prevProductModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品不存在",
        });
        return;
      }

      const oldCoverImage = prevProductModel?.cover_image;
      const newCoverImage = fileData?.filename;

      const productModel = await ctx.service.product.upsertProduct({
        id,
        name,
        description: desc ?? "",
        discounted_score: discountedScore,
        original_score: Number(original_score),
        stock: Number(stock),
        cover_image: newCoverImage,
        category_id,
        flash_sale_start: discountedScore
          ? startOfDay(flash_sale_start!)
          : null,
        flash_sale_end: discountedScore ? endOfDay(flash_sale_end!) : null,
      });

      oldCoverImage &&
        newCoverImage &&
        app.deleteFile({ fileUrl: oldCoverImage });

      if (!productModel) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取商品异常",
        });
        return;
      }

      const entity = this._productModelToEntity(productModel);

      ctx.responseSuccess({
        data: entity,
        message: `${id ? "更新" : "创建"}成功`,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async getProductList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.product.getProductList();

      const productList: ProductEntity[] = list.map((item) => {
        return this._productModelToEntity(item);
      });
      logger.tag("[getProductList]").info("list", productList);

      ctx.responseSuccess({
        data: productList,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async deleteProduct() {
    const { ctx, app } = this;
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少商品 id",
        });
        return;
      }

      const productModel = await ctx.service.product.findProductById(id);

      if (!productModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品不存在",
        });
        return;
      }

      const coverImage = productModel?.cover_image;

      if (coverImage) {
        await app.deleteFile({ fileUrl: coverImage });
      }

      await ctx.service.product.deleteProduct(id);
      ctx.responseSuccess({
        message: "删除成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  private _productShopCartModelToEntity(model: ProductShopCartModel) {
    const { ctx } = this;
    const entity: ProductShopCartEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        product_id: model.product_id,
        user_id: model.user_id,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
        quantity: model.quantity,
      },
      {
        ignoreList: [undefined, null],
      }
    );

    return entity;
  }

  public async updateProductShopCart() {
    const { ctx } = this;
    try {
      const params = ctx.getParams<{
        id?: string;
        product_id: string;
        quantity: number;
      }>();

      const { id, product_id, quantity } = params;

      logger.tag("[updateProductShopCart]").info(params);

      if (!product_id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品不能为空",
        });
        return;
      }

      if (!quantity) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品数量不能为空",
        });
        return;
      }

      if (id) {
        const productShopCartModel =
          await ctx.service.product.findProductShopCart({
            id,
          });
        if (!productShopCartModel) {
          ctx.responseFail({
            code: SERVER_CODE.BAD_REQUEST,
            message: "购物车不存在",
          });
          return;
        }
      }

      const productModel = await ctx.service.product.findProductById(
        product_id
      );

      if (!productModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品不存在",
        });
        return;
      }

      const productShopCartModel =
        await ctx.service.product.upsertProductShopCart({
          id,
          product_id,
          quantity,
        });

      if (!productShopCartModel) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取购物车异常",
        });
        return;
      }

      const entity = this._productShopCartModelToEntity(productShopCartModel);

      ctx.responseSuccess({
        data: entity,
        message: `${id ? "更新" : "创建"}成功`,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async deleteProductShopCart() {
    const { ctx } = this;
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少购物车 id",
        });
        return;
      }

      const productShopCartModel =
        await ctx.service.product.findProductShopCart({
          id,
        });

      if (!productShopCartModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "购物车不存在",
        });
        return;
      }

      await ctx.service.product.deleteProductShopCart(id);
      ctx.responseSuccess({
        message: "删除成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async getProductShopCartList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.product.getProductShopCartList();

      const productShopCartList: ProductShopCartEntity[] = list.map((item) => {
        return this._productShopCartModelToEntity(item);
      });
      logger.tag("[getProductShopCartList]").info("list", productShopCartList);

      ctx.responseSuccess({
        data: productShopCartList,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }
}
