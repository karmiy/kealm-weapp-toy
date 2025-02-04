import { Service } from "egg";
import { Logger } from "../utils/logger";
import { SERVER_CODE } from "../utils/constants";
import { JsError } from "../utils/error";
import { ProductOrderModel } from "../model/productOrder";

const logger = Logger.getLogger("[OrderService]");

/**
 * Order Service
 */
export default class Order extends Service {
  public async findProductOrder(
    fields: Partial<ProductOrderModel>
  ): Promise<ProductOrderModel | null> {
    const { ctx } = this;
    const productOrder = await ctx.model.ProductOrder.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      // raw: true,
    });
    return productOrder as any as ProductOrderModel;
  }

  public async createProductOrder(fields: Partial<ProductOrderModel>) {
    try {
      const { ctx } = this;
      const { groupId, userId } = ctx.getUserInfo();
      const insertResponse = await ctx.model.ProductOrder.create(
        {
          ...fields,
          group_id: groupId,
          user_id: userId,
        },
        {
          returning: true,
        }
      );
      const id = (insertResponse as any).id;
      if (!id) {
        logger.tag("[createProductOrder]").error("cannot get id after create");
        return Promise.reject(
          new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "创建失败")
        );
      }
      const model = await this.findProductOrder({
        id,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[createProductOrder]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "创建失败")
      );
    }
  }

  public async deleteProductOrder(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.ProductOrder.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deleteProductOrder]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  async getProductOrderList() {
    const { ctx } = this;
    const { groupId, userId, isAdmin } = ctx.getUserInfo();

    // 使用模型获取所有产品类别
    const productOrders = await ctx.model.ProductOrder.findAll({
      // raw: true,
      where: {
        group_id: groupId,
        ...(!isAdmin ? { user_id: userId } : {}),
        is_deleted: 0,
      },
      order: [["last_modified_time", "desc"]],
    });

    if (!productOrders) {
      logger.error("[getProductOrderList] cannot get product order list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return productOrders as any as ProductOrderModel[];
  }

  public async updateProductOrderPartial(
    fields: Partial<ProductOrderModel>,
    where: Partial<ProductOrderModel>
  ) {
    try {
      const { ctx } = this;
      await ctx.model.ProductOrder.update(
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
      logger.tag("[updateProductOrderPartial]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, `更新失败`)
      );
    }
  }
}
