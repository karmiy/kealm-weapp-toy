import { Service } from "egg";
import { Logger } from "../utils/logger";
import { SERVER_CODE } from "../utils/constants";
import { JsError } from "../utils/error";
import { CouponModel } from "../model/coupon";
import { UserCouponWithCouponModel } from "../model/userCoupon";
const logger = Logger.getLogger("[CouponService]");

/**
 * Coupon Service
 */
export default class Coupon extends Service {
  public async findCoupon(
    fields: Partial<CouponModel>
  ): Promise<CouponModel | null> {
    const { ctx } = this;
    // const { groupId } = ctx.getUserInfo();
    const coupon = await ctx.model.Coupon.findOne({
      where: {
        ...fields,
        // group_id: groupId,
        is_deleted: 0,
      },
      // raw: true,
    });
    return coupon as any as CouponModel;
  }

  public async findUserCoupon(
    fields: Partial<UserCouponWithCouponModel>,
    couponFields?: Partial<CouponModel>
  ): Promise<UserCouponWithCouponModel | null> {
    const { ctx } = this;
    const userCoupon = await ctx.model.UserCoupon.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      include: [
        {
          model: ctx.model.Coupon,
          as: "coupon",
          // attributes: [
          //   "id",
          //   "name",
          //   "type",
          //   "value",
          //   "minimum_order_value",
          //   "validity_time_type",
          //   "start_time",
          //   "end_time",
          //   "dates",
          //   "days",
          // ],
          required: true,
          where: {
            is_deleted: 0,
            ...couponFields,
          },
        },
      ],
    });
    return userCoupon as any as UserCouponWithCouponModel;
  }

  public async upsertCoupon(fields: Partial<CouponModel>) {
    try {
      const { ctx } = this;
      const { groupId, userId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.Coupon.upsert(
        {
          ...fields,
          group_id: groupId,
          user_id: userId,
        },
        {
          returning: true,
        }
      );
      const id = (upsertResponse[0] as any).id;
      if (!id) {
        logger.tag("[upsertCoupon]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findCoupon({
        id,
        group_id: groupId,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertCoupon]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  public async upsertUserCoupon(fields: Partial<UserCouponWithCouponModel>) {
    try {
      const { ctx } = this;
      const { groupId, userId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.UserCoupon.upsert(
        {
          ...fields,
          group_id: groupId,
          user_id: userId,
        },
        {
          returning: true,
        }
      );
      const id = (upsertResponse[0] as any).id;
      if (!id) {
        logger.tag("[upsertUserCoupon]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findUserCoupon(
        {
          id,
          group_id: groupId,
          user_id: userId,
        },
        {
          group_id: groupId,
        }
      );
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertUserCoupon]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  async getCouponList() {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();

    const coupons = await ctx.model.Coupon.findAll({
      // raw: true,
      where: {
        group_id: groupId,
        is_deleted: 0,
      },
      order: [["last_modified_time", "desc"]],
    });

    if (!coupons) {
      logger.error("[getCouponList] cannot get coupon list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return coupons as any as CouponModel[];
  }

  async getUserCouponList() {
    const { ctx } = this;
    const { groupId, userId } = ctx.getUserInfo();

    const coupons = await ctx.model.UserCoupon.findAll({
      // raw: true,
      where: {
        user_id: userId,
        group_id: groupId,
        is_deleted: 0,
      },
      order: [["last_modified_time", "desc"]],
      include: [
        {
          model: ctx.model.Coupon,
          as: "coupon",
          required: true,
          where: {
            is_deleted: 0,
            group_id: groupId,
          },
        },
      ],
    });

    const list = coupons as any as UserCouponWithCouponModel[];

    if (!list) {
      logger.error("[getUserCouponList] cannot get user coupon list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return list as any as UserCouponWithCouponModel[];
  }

  public async deleteCoupon(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.Coupon.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deleteCoupon]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }
}
