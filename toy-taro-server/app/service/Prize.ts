import { Service } from "egg";
import { QueryTypes } from "sequelize";
import { Logger } from "../utils/logger";
import { JsError } from "../utils/error";
import { COUPON_STATUS, PRIZE_TYPE, SERVER_CODE } from "../utils/constants";
import { PrizeModel } from "../model/prize";
import { QueryFields, QueryWhere } from "../utils/types";

const logger = Logger.getLogger("[PrizeService]");

/**
 * Prize Service
 */
export default class Prize extends Service {
  public async findPrize(
    fields: Partial<PrizeModel>
  ): Promise<PrizeModel | null> {
    const { ctx } = this;
    const prize = await ctx.model.Prize.findOne({
      where: {
        is_deleted: 0,
        ...fields,
      },
      // raw: true,
    });
    return prize as any as PrizeModel;
  }

  public async upsertPrize(fields: QueryFields<PrizeModel>) {
    try {
      const { ctx } = this;
      const { groupId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.Prize.upsert(
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
        logger.tag("[upsertPrize]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findPrize({
        id,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertPrize]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  public async updatePrizePartial(
    fields: QueryFields<PrizeModel>,
    where: QueryWhere<PrizeModel>
  ) {
    try {
      const { ctx } = this;
      await ctx.model.Prize.update(
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
      logger.tag("[updatePrizePartial]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, `更新失败`)
      );
    }
  }

  async updateSortValues(sortMap: Map<string, number>) {
    const { ctx } = this;

    if (sortMap.size === 0) {
      return;
    }

    // 构造 CASE WHEN 语句
    const caseWhenStatements = Array.from(sortMap.entries())
      .map(([id, sortValue]) => `WHEN id = ${id} THEN ${sortValue}`)
      .join(" ");

    // 构造 WHERE IN 语句
    const ids = Array.from(sortMap.keys()).join(", ");

    const query = `
      UPDATE prize 
      SET sort_value = CASE 
        ${caseWhenStatements}
      END
      WHERE id IN (${ids});
    `;

    try {
      await ctx.model.query(query, {
        type: QueryTypes.UPDATE,
      });
    } catch (error) {
      logger.error("[updateSortValues] error", error);
      throw new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "奖品排序更新失败");
    }
  }

  public async deletePrize(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.Prize.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deletePrize]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  async getPrizeList(where?: QueryWhere<PrizeModel>) {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();

    const prizes = await ctx.model.Prize.findAll({
      where: {
        group_id: groupId,
        is_deleted: 0,
        ...where,
      },
      order: [["sort_value", "desc"]],
    });

    if (!prizes) {
      logger.error("[getPrizeList] cannot get prize list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return prizes as any as PrizeModel[];
  }

  async createSortValue() {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();

    const maxSortPrize = await ctx.model.Prize.findOne({
      where: {
        group_id: groupId,
        is_deleted: 0,
      },
      order: [["sort_value", "desc"]],
    });

    if (!maxSortPrize) {
      return 1;
    }
    return (maxSortPrize as any as PrizeModel).sort_value + 1;
  }

  async grantReward(params: { id: string; userId: string }) {
    try {
      const { id, userId } = params;
      const { ctx } = this;
      const prize = await this.findPrize({
        id,
      });
      if (!prize) {
        return Promise.reject(
          new JsError(SERVER_CODE.BAD_REQUEST, "奖品不存在")
        );
      }
      if (prize.type === PRIZE_TYPE.NONE) {
        return;
      }
      const user = await ctx.service.user.findUserById(userId);
      if (prize.type === PRIZE_TYPE.POINTS) {
        const addedScore = prize.points ?? 0;
        await ctx.service.user.updateUserById(userId, {
          score: user.score + addedScore,
        });
        return;
      }
      if (prize.type === PRIZE_TYPE.COUPON) {
        const couponId = prize.coupon_id;
        if (!couponId) {
          return Promise.reject(
            new JsError(SERVER_CODE.BAD_REQUEST, "奖品优惠券不存在")
          );
        }
        await ctx.service.coupon.upsertUserCoupon({
          coupon_id: couponId,
          status: COUPON_STATUS.ACTIVE,
          user_id: userId,
        });
        return;
      }
      if (prize.type === PRIZE_TYPE.LUCKY_DRAW) {
        const addedDrawTickets = prize.draw_count ?? 0;
        await ctx.service.user.updateUserById(userId, {
          draw_ticket: user.draw_ticket + addedDrawTickets,
        });
        return;
      }
    } catch (error) {
      logger.tag("[grantReward]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "奖励发放失败")
      );
    }
  }
}
