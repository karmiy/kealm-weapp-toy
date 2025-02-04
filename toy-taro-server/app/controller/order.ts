import { Controller } from "egg";
import { Logger } from "../utils/logger";
import {
  COUPON_STATUS,
  PRODUCT_ORDER_STATUS,
  SERVER_CODE,
} from "../utils/constants";
import { UserCouponWithCouponModel } from "../model/userCoupon";
import { ProductModel } from "../model/product";
import { ProductOrderModel } from "../model/productOrder";
import { ProductOrderEntity } from "../entity/order";

const logger = Logger.getLogger("[OrderController]");

export default class OrderController extends Controller {
  private _getProductScore(product: ProductModel) {
    const now = new Date().getTime();
    const {
      discounted_score,
      original_score,
      flash_sale_start,
      flash_sale_end,
    } = product;
    const isLimitedTimeOffer =
      discounted_score &&
      flash_sale_start &&
      flash_sale_end &&
      flash_sale_start.getTime() <= now &&
      flash_sale_end.getTime() >= now;
    const score = isLimitedTimeOffer
      ? discounted_score ?? original_score
      : original_score;
    return score;
  }

  private _productOrderModelToEntity(model: ProductOrderModel) {
    const { ctx } = this;
    const entity: ProductOrderEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        products: model.products,
        score: model.score,
        discount_score: model.discount_score,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
        status: model.status,
        user_id: model.user_id,
      },
      {
        ignoreList: [undefined],
      }
    );

    return entity;
  }

  public async createProductOrder() {
    const { ctx } = this;
    try {
      const { userId, groupId } = ctx.getUserInfo();
      const params = ctx.getParams<{
        shop_cart_ids?: string[];
        coupon_id?: string;
      }>();

      const { shop_cart_ids, coupon_id } = params;

      logger.tag("[createProductOrder]").info(params);

      if (!shop_cart_ids?.length) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品清单不能为空",
        });
        return;
      }

      let userCouponModel: UserCouponWithCouponModel | null = null;

      if (coupon_id) {
        userCouponModel = await ctx.service.coupon.findUserCoupon({
          id: coupon_id,
          user_id: userId,
          group_id: groupId,
        });

        if (!userCouponModel) {
          ctx.responseFail({
            code: SERVER_CODE.BAD_REQUEST,
            message: "选择的优惠券不存在",
          });
          return;
        }
      }
      const shopCartModels =
        await ctx.service.product.getProductShopCartListWithProductByIds(
          shop_cart_ids
        );
      if (!shopCartModels.length) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "商品清单不能为空",
        });
        return;
      }

      // 检查库存
      const isUnderStock = shopCartModels.some((shopCart) => {
        const { product, quantity } = shopCart;
        if (!product) {
          return true;
        }
        return product.stock < quantity;
      });
      if (isUnderStock) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "库存不足",
        });
        return;
      }
      const totalScore = shopCartModels.reduce((sum, curr) => {
        const quantity = Number(curr.quantity);
        const product = curr.product;
        if (!product || !quantity) {
          return sum;
        }
        const score = this._getProductScore(product);
        return sum + score * quantity;
      }, 0);
      const user = await ctx.service.user.findUserById(userId);
      const { score } = user;

      let discountScore = totalScore;

      // 计算优惠券优惠金额
      if (userCouponModel) {
        const couponDiscountInfo = ctx.service.coupon.getCouponDiscountInfo(
          totalScore,
          userCouponModel
        );
        if (!couponDiscountInfo.enabled) {
          ctx.responseFail({
            code: SERVER_CODE.BAD_REQUEST,
            message: "优惠券不可用",
          });
          return;
        }
        discountScore = totalScore - couponDiscountInfo.score;
      }
      // 检查积分是否充足
      logger
        .tag("[createProductOrder]")
        .info("score", { totalScore, discountScore, userScore: score });

      if (score < discountScore) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "积分不足",
        });
        return;
      }

      // 开始创建订单
      let errorMes = "";
      const products: Array<{
        id: string;
        name: string;
        description: string;
        stock: number;
        quantity: number;
        cover_image: string;
      }> = [];
      for (const shopCartModel of shopCartModels) {
        const { product, quantity } = shopCartModel;
        if (!product) {
          errorMes = `商品 ${shopCartModel.product_id} 不存在`;
          break;
        }
        if (!quantity) {
          errorMes = `商品 ${shopCartModel.product_id} 数量不能为空`;
          break;
        }
        products.push({
          id: product.id,
          name: product.name,
          description: product.description ?? "",
          stock: product.stock,
          quantity,
          cover_image: product.cover_image,
        });
      }

      logger
        .tag("[createProductOrder]")
        .info("get products", { products, errorMes });

      if (errorMes) {
        products.length = 0;
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: errorMes,
        });
        return;
      }

      const order = await ctx.service.order.createProductOrder({
        products: products.map((item) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            count: item.quantity,
            cover_image: item.cover_image,
          };
        }),
        coupon_id: userCouponModel?.id,
        score: totalScore,
        discount_score:
          discountScore === totalScore ? undefined : discountScore,
        status: PRODUCT_ORDER_STATUS.INITIAL,
      });

      if (!order) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "订单创建失败",
        });
        return;
      }

      // 清理购物车
      try {
        await ctx.service.product.deleteProductShopCarts(shop_cart_ids);
      } catch (error) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "购物车清理失败",
        });
      }

      // 更新库存
      try {
        await Promise.all(
          products.map(async (item) => {
            await ctx.service.product.updateProductsPartial(
              {
                stock: Math.max(item.stock - item.quantity, 0),
              },
              {
                id: item.id,
              }
            );
          })
        );
      } catch (error) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "库存更新失败",
        });
        return;
      }

      // 更新用户积分
      try {
        await ctx.service.user.updateUserById(userId, {
          score: score - discountScore,
        });
      } catch (error) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "用户积分更新失败",
        });
        return;
      }

      // 更新优惠券状态
      if (userCouponModel) {
        try {
          await ctx.service.coupon.updateUserCouponsPartial(
            {
              status: COUPON_STATUS.USED,
            },
            {
              id: userCouponModel.id,
            }
          );
        } catch (error) {
          ctx.responseFail({
            code: SERVER_CODE.INTERNAL_SERVER_ERROR,
            message: "优惠券状态更新失败",
          });
          return;
        }
      }

      const entity = this._productOrderModelToEntity(order);

      ctx.responseSuccess({
        data: entity,
        message: "创建成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async getProductOrderList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.order.getProductOrderList();

      const orderList: ProductOrderEntity[] = list.map((item) =>
        this._productOrderModelToEntity(item)
      );
      logger.tag("[getProductOrderList]").info("list", orderList);

      ctx.responseSuccess({
        data: orderList,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async updateProductOrderStatus() {
    const { ctx } = this;
    try {
      const { id, status } = ctx.getParams<{
        id: string;
        status: PRODUCT_ORDER_STATUS;
      }>();

      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "订单 id 不能为空",
        });
        return;
      }

      const order = await ctx.service.order.findProductOrder({
        id,
      });

      if (!order) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "订单不存在",
        });
        return;
      }

      const user = await ctx.service.user.findUserById(order.user_id);
      if (!user) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "用户不存在",
        });
        return;
      }

      if (!status) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "订单状态不能为空",
        });
        return;
      }

      if (
        ![
          PRODUCT_ORDER_STATUS.INITIAL,
          PRODUCT_ORDER_STATUS.APPROVED,
          PRODUCT_ORDER_STATUS.REJECTED,
          PRODUCT_ORDER_STATUS.REVOKING,
        ].includes(status)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "订单状态错误",
        });
        return;
      }

      if (status === PRODUCT_ORDER_STATUS.APPROVED) {
        // 更新库存
        const products = order.products;
        const productRollbackInfos: Array<{
          id: string;
          stock: number;
          rollbackStock: number;
        }> = [];
        let errorMes = "";
        for (const item of products) {
          const product = await ctx.service.product.findProductById(item.id);
          if (!product) {
            errorMes = `商品 ${item.name} 不存在`;
            break;
          }
          productRollbackInfos.push({
            id: product.id,
            stock: product.stock,
            rollbackStock: item.count,
          });
        }
        if (errorMes) {
          productRollbackInfos.length = 0;
          ctx.responseFail({
            code: SERVER_CODE.BAD_REQUEST,
            message: errorMes,
          });
          return;
        }
        const caseStatement = `
          CASE 
            ${productRollbackInfos
              .map(
                (item) =>
                  `WHEN id = ${item.id} THEN ${item.stock + item.rollbackStock}`
              )
              .join("\n    ")}
            ELSE stock
          END
        `;
        await ctx.service.product.updateProductsPartial(
          {
            stock: ctx.app.Sequelize.literal(caseStatement),
          },
          {
            id: productRollbackInfos.map((item) => item.id),
          }
        );

        // 更新用户积分
        const rollbackScore = order.discount_score ?? order.score;
        await ctx.service.user.updateUserById(order.user_id, {
          score: user.score + rollbackScore,
        });

        // 更新优惠券状态
        if (order.coupon_id) {
          await ctx.service.coupon.updateUserCouponsPartial(
            {
              status: COUPON_STATUS.ACTIVE,
            },
            {
              id: order.coupon_id,
            }
          );
        }
      }

      await ctx.service.order.updateProductOrderPartial(
        {
          status,
        },
        {
          id,
        }
      );

      const updatedOrder = await ctx.service.order.findProductOrder({
        id,
      });

      if (!updatedOrder) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "更新后获取订单失败",
        });
        return;
      }

      const entity = this._productOrderModelToEntity(updatedOrder);

      ctx.responseSuccess({
        data: entity,
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
