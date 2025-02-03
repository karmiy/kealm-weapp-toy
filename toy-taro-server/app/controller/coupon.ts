import { Controller } from "egg";
import { startOfDay, endOfDay } from "date-fns";
import { Logger } from "../utils/logger";
import { CouponEntity, CouponValidityTime } from "../entity/coupon";
import {
  SERVER_CODE,
  COUPON_TYPE,
  COUPON_STATUS,
  COUPON_VALIDITY_TIME_TYPE,
  TASK_REWARD_TYPE,
} from "../utils/constants";
import { CouponModel } from "../model/coupon";
import { UserCouponWithCouponModel } from "../model/userCoupon";
import { JsError } from "../utils/error";

const logger = Logger.getLogger("[CouponController]");

export default class CouponController extends Controller {
  private _couponModelToEntity(couponModel: CouponModel) {
    const { start_time, end_time, dates, days } = couponModel;
    const validityTime = {
      type: couponModel.validity_time_type,
    } as CouponValidityTime;

    if (validityTime.type === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE) {
      if (!start_time || !end_time) {
        throw new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          "有效范围不能为空"
        );
      }
      validityTime.start_time = startOfDay(start_time).getTime();
      validityTime.end_time = endOfDay(end_time).getTime();
    }
    if (validityTime.type === COUPON_VALIDITY_TIME_TYPE.DATE_LIST) {
      if (!dates?.length) {
        throw new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          "有效日期不能为空"
        );
      }
      validityTime.dates = dates.map((date) =>
        endOfDay(new Date(date)).getTime()
      );
    }
    if (validityTime.type === COUPON_VALIDITY_TIME_TYPE.WEEKLY) {
      if (!days?.length) {
        throw new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          "有效星期不能为空"
        );
      }
      validityTime.days = days;
    }

    const entity: CouponEntity = {
      id: couponModel.id,
      name: couponModel.name,
      user_id: couponModel.user_id,
      create_time: couponModel.create_time.getTime(),
      last_modified_time: couponModel.last_modified_time.getTime(),
      validity_time: validityTime,
      status: COUPON_STATUS.ACTIVE,
      type: couponModel.type,
      value: couponModel.value,
      minimum_order_value: couponModel.minimum_order_value,
    };
    return entity;
  }

  private async _userCouponWithCouponModelToEntity(
    userCouponModel: UserCouponWithCouponModel
  ) {
    const { coupon: couponModel } = userCouponModel;

    if (!couponModel) {
      throw new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "优惠券不存在");
    }

    const baseEntity = this._couponModelToEntity(couponModel);

    const entity: CouponEntity = {
      ...baseEntity,
      id: userCouponModel.id,
      user_id: userCouponModel.user_id,
      create_time: userCouponModel.create_time.getTime(),
      last_modified_time: userCouponModel.last_modified_time.getTime(),
      status: userCouponModel.status,
    };
    return entity;
  }

  public async updateCoupon() {
    const { ctx } = this;
    try {
      const { groupId } = ctx.getUserInfo();
      const params = ctx.getParams<{
        id?: string;
        name: string;
        minimum_order_value: number;
        type: COUPON_TYPE;
        value: number;
        validity_time_type: COUPON_VALIDITY_TIME_TYPE;
        dates?: string[];
        days?: number[];
        start_time?: string;
        end_time?: string;
      }>();

      const {
        id,
        name,
        minimum_order_value,
        type,
        value,
        validity_time_type,
        dates,
        days,
        start_time,
        end_time,
      } = params;

      logger.tag("[updateCoupon]").info(params);

      if (!name) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券名称不能为空",
        });
        return;
      }

      if (!type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券类型不能为空",
        });
        return;
      }

      if (
        ![COUPON_TYPE.CASH_DISCOUNT, COUPON_TYPE.PERCENTAGE_DISCOUNT].includes(
          type
        )
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券类型错误",
        });
        return;
      }

      if (!value) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "满减/打折金额不能为空",
        });
        return;
      }

      if (typeof minimum_order_value !== "number") {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "最低使用门槛不能为空",
        });
        return;
      }

      if (!validity_time_type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "有效期类型不能为空",
        });
        return;
      }

      if (
        ![
          COUPON_VALIDITY_TIME_TYPE.DATE_LIST,
          COUPON_VALIDITY_TIME_TYPE.DATE_RANGE,
          COUPON_VALIDITY_TIME_TYPE.WEEKLY,
        ].includes(validity_time_type)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "有效期类型错误",
        });
        return;
      }

      if (
        validity_time_type === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE &&
        (!start_time || !end_time)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠起止时间不能为空",
        });
        return;
      }

      if (
        validity_time_type === COUPON_VALIDITY_TIME_TYPE.DATE_LIST &&
        !dates?.length
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "有效日期不能为空",
        });
        return;
      }

      if (
        validity_time_type === COUPON_VALIDITY_TIME_TYPE.WEEKLY &&
        !days?.length
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "有效星期不能为空",
        });
        return;
      }

      if (
        validity_time_type === COUPON_VALIDITY_TIME_TYPE.WEEKLY &&
        days &&
        days?.some((day) => day <= 0 || day > 7)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "存在非法星期",
        });
        return;
      }

      const prevCouponModel = id
        ? await ctx.service.coupon.findCoupon({ id, group_id: groupId })
        : null;
      if (id && !prevCouponModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券不存在",
        });
        return;
      }

      const availableDates =
        validity_time_type === COUPON_VALIDITY_TIME_TYPE.DATE_LIST &&
        dates?.length
          ? [...new Set(dates.map((date) => endOfDay(date).getTime()))].sort(
              (a, b) => a - b
            )
          : null;

      const availableDays =
        validity_time_type === COUPON_VALIDITY_TIME_TYPE.WEEKLY && days?.length
          ? [...new Set(days)].sort((a, b) => a - b)
          : null;

      const startTime =
        validity_time_type === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE &&
        start_time
          ? startOfDay(start_time).getTime()
          : null;

      const endTime =
        validity_time_type === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE && end_time
          ? endOfDay(end_time).getTime()
          : null;

      const couponModel = await ctx.service.coupon.upsertCoupon({
        id,
        name,
        minimum_order_value,
        type,
        value,
        validity_time_type,
        dates: availableDates,
        days: availableDays,
        start_time: startTime,
        end_time: endTime,
      });

      if (!couponModel) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取优惠券异常",
        });
        return;
      }

      const entity = this._couponModelToEntity(couponModel);

      // 更新 task 表中的相关 coupon 数据
      await ctx.service.task.updateTasksPartial(
        {
          reward_coupon_id: couponModel.id,
          reward_type:
            couponModel.type === COUPON_TYPE.CASH_DISCOUNT
              ? TASK_REWARD_TYPE.CASH_DISCOUNT
              : TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT,
          reward_value: couponModel.value,
          reward_minimum_order_value: couponModel.minimum_order_value,
        },
        {
          reward_coupon_id: couponModel.id,
        }
      );

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

  public async updateUserCoupon() {
    const { ctx } = this;
    try {
      const { groupId, userId } = ctx.getUserInfo();
      const params = ctx.getParams<{
        id?: string;
        coupon_id?: string;
        status?: COUPON_STATUS;
      }>();

      const { id, coupon_id, status } = params;

      logger.tag("[updateUserCoupon]").info(params);

      if (id && !coupon_id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券 id 不能为空",
        });
        return;
      }

      if (id && !status) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券状态不能为空",
        });
        return;
      }

      if (
        status &&
        ![COUPON_STATUS.ACTIVE, COUPON_STATUS.USED].includes(status)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券状态错误",
        });
        return;
      }

      const couponModel = await ctx.service.coupon.findCoupon({
        id: coupon_id,
        group_id: groupId,
      });
      if (!couponModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券不存在",
        });
        return;
      }

      const prevUserCouponModel = id
        ? await ctx.service.coupon.findUserCoupon(
            {
              id,
              group_id: groupId,
              user_id: userId,
            },
            {
              group_id: groupId,
            }
          )
        : null;

      if (id && !prevUserCouponModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "用户优惠券不存在",
        });
        return;
      }

      const userCouponModel = await ctx.service.coupon.upsertUserCoupon({
        id,
        coupon_id,
        status,
      });

      if (!userCouponModel) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取优惠券异常",
        });
        return;
      }

      const entity = await this._userCouponWithCouponModelToEntity(
        userCouponModel
      );

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

  public async getCouponList() {
    const { ctx } = this;
    const { isAdmin } = ctx.getUserInfo();
    try {
      logger.tag("[getCouponList]").info("isAdmin", isAdmin);

      if (isAdmin) {
        const list = await ctx.service.coupon.getCouponList();
        const entities = list.map((item) => this._couponModelToEntity(item));

        ctx.responseSuccess({
          data: entities,
        });
        return;
      }
      const list = await ctx.service.coupon.getUserCouponList();

      const entities = await Promise.all(
        list.map((item) => this._userCouponWithCouponModelToEntity(item))
      );

      ctx.responseSuccess({
        data: entities,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async deleteCoupon() {
    const { ctx } = this;
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少优惠券 id",
        });
        return;
      }
      const couponModel = await ctx.service.coupon.findCoupon({
        id,
      });

      if (!couponModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券不存在",
        });
        return;
      }
      const userCouponModel = await ctx.service.coupon.findUserCoupon({
        coupon_id: id,
      });
      if (userCouponModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "无法删除，优惠券正在被用户使用",
        });
        return;
      }
      await ctx.service.coupon.deleteCoupon(id);
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
}
