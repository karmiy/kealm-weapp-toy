import { Controller } from "egg";
import { Op } from "sequelize";
import { Logger } from "../utils/logger";
import { PRIZE_TYPE, SERVER_CODE } from "../utils/constants";
import { PrizeEntity } from "../entity/prize";
import { PrizeModel } from "../model/prize";

const logger = Logger.getLogger("[PrizeController]");

export default class PrizeController extends Controller {
  private _prizeModelToEntity(model: PrizeModel): PrizeEntity {
    const { ctx } = this;
    const entity: PrizeEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        type: model.type,
        coupon_id: model.coupon_id,
        points: model.points,
        draw_count: model.draw_count,
        text: model.text,
        sort_value: model.sort_value,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
      },
      {
        ignoreList: [undefined, null],
      }
    );

    return entity;
  }

  public async updatePrize() {
    const { ctx } = this;
    const { userId, groupId } = ctx.getUserInfo();
    try {
      const params = ctx.getParams<{
        id?: string;
        type: PRIZE_TYPE;
        points?: number;
        coupon_id?: string;
        draw_count?: number;
        text?: string;
      }>();

      const { id, type, points, coupon_id, draw_count, text } = params;

      logger.tag("[updatePrize]").info(params);

      if (!type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖品类型不能为空",
        });
        return;
      }

      if (
        ![
          PRIZE_TYPE.POINTS,
          PRIZE_TYPE.COUPON,
          PRIZE_TYPE.LUCKY_DRAW,
          PRIZE_TYPE.NONE,
        ].includes(type)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖品类型错误",
        });
        return;
      }

      if (type === PRIZE_TYPE.POINTS && !points) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖品积分不能为空",
        });
        return;
      }

      if (type === PRIZE_TYPE.COUPON && !coupon_id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券 id 不能为空",
        });
        return;
      }

      if (type === PRIZE_TYPE.COUPON && coupon_id) {
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
      }

      if (type === PRIZE_TYPE.LUCKY_DRAW && !draw_count) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "祈愿券数量不能为空",
        });
        return;
      }

      if (type === PRIZE_TYPE.NONE && !text) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "描述不能为空",
        });
        return;
      }

      const prevPrizeModel = id
        ? await ctx.service.prize.findPrize({ id })
        : undefined;
      if (id && !prevPrizeModel) {
        if (!prevPrizeModel) {
          ctx.responseFail({
            code: SERVER_CODE.BAD_REQUEST,
            message: "奖品不存在",
          });
          return;
        }
      }
      const sortValue = !id
        ? await ctx.service.prize.createSortValue()
        : undefined;

      const prizeModel = await ctx.service.prize.upsertPrize({
        id,
        type,
        points: type === PRIZE_TYPE.POINTS ? points : null,
        coupon_id: type === PRIZE_TYPE.COUPON ? coupon_id : null,
        draw_count: type === PRIZE_TYPE.LUCKY_DRAW ? draw_count : null,
        text: type === PRIZE_TYPE.NONE ? text : null,
        user_id: !id ? userId : undefined,
        sort_value: sortValue,
      });

      if (!prizeModel) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取任务异常",
        });
        return;
      }

      const entity = this._prizeModelToEntity(prizeModel);

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

  public async getPrizeList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.prize.getPrizeList();

      const prizeList: PrizeEntity[] = list.map((item) =>
        this._prizeModelToEntity(item)
      );
      logger.tag("[getPrizeList]").info("list", prizeList);

      ctx.responseSuccess({
        data: prizeList,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async deletePrize() {
    const { ctx } = this;
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少奖品 id",
        });
        return;
      }
      const prizeModel = await ctx.service.prize.findPrize({
        id,
      });

      if (!prizeModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖品不存在",
        });
        return;
      }
      const taskModel = await ctx.service.task.findTask({
        prize_id: id,
      });
      if (taskModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: `无法删除，任务《${taskModel.name}》正在占用`,
        });
        return;
      }

      // 检查祈愿池列表中是否包含该奖品
      const luckyDrawList = await ctx.service.luckyDraw.getLuckyDrawList();
      const occupiedLuckyDraw = luckyDrawList.find((luckyDraw) =>
        luckyDraw.list.some((item) => item.prize_id === id)
      );
      if (occupiedLuckyDraw) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: `无法删除，祈愿池《${occupiedLuckyDraw.name}》正在占用`,
        });
        return;
      }

      await ctx.service.prize.deletePrize(id);
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

  public async sortPrize() {
    const { ctx } = this;
    try {
      const { ids } = ctx.getParams<{ ids: string[] }>();
      const list = await ctx.service.prize.getPrizeList({
        id: { [Op.in]: ids },
      });
      const sortValues = list
        .map((item) => item.sort_value)
        .sort((a, b) => b - a);
      if (sortValues.length !== ids.length) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "排序失败，存在无效奖品 id",
        });
        return;
      }
      const idToSortValue = new Map<string, number>();
      ids.forEach((id, index) => {
        idToSortValue.set(id, sortValues[index]);
      });
      await ctx.service.prize.updateSortValues(idToSortValue);

      const data = [...idToSortValue.entries()].map(([id, sort_value]) => {
        return {
          id,
          sort_value,
        };
      });

      ctx.responseSuccess({
        data,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async grantReward() {
    const { ctx } = this;
    const { userId } = ctx.getUserInfo();
    try {
      const { id } = ctx.getParams<{ id: string }>();
      await ctx.service.prize.grantReward({
        id,
        userId,
      });

      ctx.responseSuccess({
        message: "领取成功",
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
