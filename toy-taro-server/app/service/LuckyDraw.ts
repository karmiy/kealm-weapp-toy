import { Service } from "egg";
import { Logger } from "../utils/logger";
import { JsError } from "../utils/error";
import { SERVER_CODE } from "../utils/constants";
import { LuckyDrawModel } from "../model/luckyDraw";
import { LuckyDrawHistoryModel } from "../model/luckyDrawHistory";
import { QueryFields, QueryWhere } from "../utils/types";
import { weightedRandomIndex } from "../utils/luckyDrawHelper";

const logger = Logger.getLogger("[LuckyDrawService]");

/**
 * LuckyDraw Service
 */
export default class LuckyDraw extends Service {
  public async findLuckyDraw(
    fields: Partial<LuckyDrawModel>
  ): Promise<LuckyDrawModel | null> {
    const { ctx } = this;
    const luckyDraw = await ctx.model.LuckyDraw.findOne({
      where: {
        is_deleted: 0,
        ...fields,
      },
    });
    return luckyDraw as any as LuckyDrawModel;
  }

  public async upsertLuckyDraw(fields: QueryFields<LuckyDrawModel>) {
    try {
      const { ctx } = this;
      const { groupId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.LuckyDraw.upsert(
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
        logger.tag("[upsertLuckyDraw]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findLuckyDraw({
        id,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertLuckyDraw]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  public async updateLuckyDrawPartial(
    fields: QueryFields<LuckyDrawModel>,
    where: QueryWhere<LuckyDrawModel>
  ) {
    try {
      const { ctx } = this;
      await ctx.model.LuckyDraw.update(
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
      logger.tag("[updateLuckyDrawPartial]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, `更新失败`)
      );
    }
  }

  public async deleteLuckyDraw(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.LuckyDraw.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deleteLuckyDraw]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  async getLuckyDrawList(where?: QueryWhere<LuckyDrawModel>) {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();

    const luckyDraws = await ctx.model.LuckyDraw.findAll({
      where: {
        group_id: groupId,
        is_deleted: 0,
        ...where,
      },
      order: [["create_time", "desc"]],
    });

    if (!luckyDraws) {
      logger.error("[getLuckyDrawList] cannot get lucky draw list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return luckyDraws as any as LuckyDrawModel[];
  }

  public async upsertLuckyDrawHistory(
    fields: QueryFields<LuckyDrawHistoryModel>
  ) {
    try {
      const { ctx } = this;
      const { groupId, userId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.LuckyDrawHistory.upsert(
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
        logger
          .tag("[upsertLuckyDrawHistory]")
          .error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await ctx.model.LuckyDrawHistory.findOne({
        where: { id },
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertLuckyDrawHistory]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  public async startDraw(params: { id: string; userId: string }) {
    try {
      const { ctx } = this;
      const { id, userId } = params;

      // 1. 查询祈愿池
      const luckyDraw = await this.findLuckyDraw({
        id,
      });
      if (!luckyDraw) {
        return Promise.reject(
          new JsError(SERVER_CODE.BAD_REQUEST, "祈愿池不存在")
        );
      }

      // 2. 查询用户祈愿券
      const user = await ctx.service.user.findUserById(userId);
      if (user.draw_ticket < luckyDraw.quantity) {
        return Promise.reject(
          new JsError(SERVER_CODE.BAD_REQUEST, "祈愿券不足")
        );
      }

      // 3. 抽奖
      const { list } = luckyDraw;
      const index = weightedRandomIndex(list);
      const prize_id = list[index].prize_id;

      // 4. 扣除祈愿券
      await ctx.service.user.updateUserById(userId, {
        draw_ticket: user.draw_ticket - luckyDraw.quantity,
      });

      // 5. 发放奖励
      await ctx.service.prize.grantReward({
        id: prize_id,
        userId,
      });

      // 6. 记录祈愿历史
      await this.upsertLuckyDrawHistory({
        prize_id,
        user_id: userId,
      });

      return {
        prize_id,
        index,
      };
    } catch (error) {
      logger.tag("[startDraw]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "祈愿失败")
      );
    }
  }
}
