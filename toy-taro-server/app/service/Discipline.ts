import { Service } from "egg";
import { Logger } from "../utils/logger";
import { JsError } from "../utils/error";
import {
  COUPON_STATUS,
  DISCIPLINE_TYPE,
  PRIZE_TYPE,
  SERVER_CODE,
} from "../utils/constants";
import { DisciplineModel } from "../model/discipline";
import { QueryFields, QueryWhere } from "../utils/types";

const logger = Logger.getLogger("[DisciplineService]");

/**
 * Discipline Service
 */
export default class Discipline extends Service {
  /**
   * 查找奖惩记录
   * @param fields 查询条件
   */
  public async findDiscipline(
    fields: Partial<DisciplineModel>
  ): Promise<DisciplineModel | null> {
    const { ctx } = this;
    const discipline = await ctx.model.Discipline.findOne({
      where: {
        is_deleted: 0,
        ...fields,
      },
    });
    return discipline as any as DisciplineModel;
  }

  /**
   * 创建或更新奖惩记录
   * @param fields 奖惩记录字段
   */
  public async upsertDiscipline(fields: QueryFields<DisciplineModel>) {
    try {
      const { ctx } = this;
      const { userId, groupId } = ctx.getUserInfo();

      const upsertResponse = await ctx.model.Discipline.upsert(
        {
          ...fields,
          operator_id: userId,
          group_id: groupId,
        },
        {
          returning: true,
        }
      );

      const id = (upsertResponse[0] as any).id;
      if (!id) {
        logger.tag("[upsertDiscipline]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }

      const model = await this.findDiscipline({
        id,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertDiscipline]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  /**
   * 执行惩罚操作
   * @param params 惩罚参数
   */
  public async executePunishment(params: {
    user_id: string;
    prize_id: string;
  }) {
    const { ctx } = this;
    const { user_id, prize_id } = params;

    // 查找目标用户
    const user = await ctx.service.user.findUserById(user_id);
    if (!user) {
      logger.tag("[executePunishment]").error("user not found", user_id);
      return Promise.reject(
        new JsError(SERVER_CODE.BAD_REQUEST, "目标用户不存在")
      );
    }

    // 查找奖品/惩罚
    const prize = await ctx.service.prize.findPrize({ id: prize_id });
    if (!prize) {
      logger.tag("[executePunishment]").error("prize not found", prize_id);
      return Promise.reject(
        new JsError(SERVER_CODE.BAD_REQUEST, "惩罚项目不存在")
      );
    }

    // 执行惩罚操作
    if (prize.type === PRIZE_TYPE.POINTS) {
      // 扣除积分
      const deductPoints = prize.points ?? 0;
      await ctx.service.user.updateUserById(user_id, {
        score: Math.max(user.score - deductPoints, 0),
      });
    } else if (prize.type === PRIZE_TYPE.LUCKY_DRAW) {
      // 扣除祈愿券
      const deductTickets = prize.draw_count ?? 0;
      await ctx.service.user.updateUserById(user_id, {
        draw_ticket: Math.max(user.draw_ticket - deductTickets, 0),
      });
    } else if (prize.type === PRIZE_TYPE.COUPON) {
      // 回收优惠券
      const couponId = prize.coupon_id;
      if (!couponId) {
        return Promise.reject(
          new JsError(SERVER_CODE.BAD_REQUEST, "优惠券不存在")
        );
      }

      // 查找用户是否有此优惠券
      const userCoupon = await ctx.model.UserCoupon.findOne({
        where: {
          user_id,
          coupon_id: couponId,
          status: COUPON_STATUS.ACTIVE,
          is_deleted: 0,
        },
      });

      if (!userCoupon) {
        return Promise.reject(
          new JsError(SERVER_CODE.BAD_REQUEST, "用户没有此优惠券或已使用")
        );
      }

      // 回收用户优惠券（标记为删除）
      await ctx.service.coupon.updateUserCouponsPartial(
        { is_deleted: 1 },
        { id: (userCoupon as any).id }
      );
    }
  }

  /**
   * 执行奖惩操作
   * @param params 奖惩参数
   */
  private async executeDiscipline(params: {
    user_id: string;
    prize_id: string;
    type: DISCIPLINE_TYPE;
  }) {
    const { ctx } = this;
    const { user_id, prize_id, type } = params;

    // 查找目标用户
    const user = await ctx.service.user.findUserById(user_id);
    if (!user) {
      logger.tag("[executeDiscipline]").error("user not found", user_id);
      return Promise.reject(
        new JsError(SERVER_CODE.BAD_REQUEST, "目标用户不存在")
      );
    }

    // 查找奖品/惩罚
    const prize = await ctx.service.prize.findPrize({ id: prize_id });
    if (!prize) {
      logger.tag("[executeDiscipline]").error("prize not found", prize_id);
      return Promise.reject(
        new JsError(SERVER_CODE.BAD_REQUEST, "奖惩项目不存在")
      );
    }

    // 根据奖惩类型执行相应操作
    if (type === DISCIPLINE_TYPE.REWARD) {
      // 执行奖励操作
      await ctx.service.prize.grantReward({
        id: prize_id,
        userId: user_id,
      });
    } else if (type === DISCIPLINE_TYPE.PUNISHMENT) {
      // 执行惩罚操作
      await this.executePunishment({
        user_id,
        prize_id,
      });
    }
  }

  /**
   * 创建奖惩记录
   * @param params 奖惩记录字段
   */
  public async createDiscipline(params: {
    user_id: string;
    prize_id: string;
    type: DISCIPLINE_TYPE;
    reason: string;
  }) {
    const { ctx } = this;
    try {
      // 1. 执行相应的奖惩操作
      await this.executeDiscipline({
        user_id: params.user_id,
        prize_id: params.prize_id,
        type: params.type,
      });

      // 2. 先创建记录
      const record = await this.upsertDiscipline(params);

      return record;
    } catch (error) {
      const jsError = ctx.toJsError(error);
      logger.tag("[createDiscipline]").error("error", jsError);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          jsError.message || "奖惩记录创建失败"
        )
      );
    }
  }

  /**
   * 更新奖惩记录部分字段
   * @param fields 要更新的字段
   * @param where 查询条件
   */
  public async updateDisciplinePartial(
    fields: QueryFields<DisciplineModel>,
    where: QueryWhere<DisciplineModel>
  ) {
    try {
      const { ctx } = this;
      await ctx.model.Discipline.update(
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
      logger.tag("[updateDisciplinePartial]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, `更新失败`)
      );
    }
  }

  /**
   * 获取奖惩记录列表
   * @param where 查询条件
   */
  public async getDisciplineList(where?: QueryWhere<DisciplineModel>) {
    try {
      const { ctx } = this;
      const { groupId, userId } = ctx.getUserInfo();

      const disciplines = await ctx.model.Discipline.findAll({
        where: {
          group_id: groupId,
          user_id: userId,
          is_deleted: 0,
          ...where,
        },
        order: [["create_time", "desc"]],
      });

      if (!disciplines) {
        logger.error("[getDisciplineList] cannot get discipline list");
        return Promise.reject(
          new JsError(SERVER_CODE.NOT_FOUND, "奖惩记录列表获取失败")
        );
      }

      return disciplines as any as DisciplineModel[];
    } catch (error) {
      logger.tag("[getDisciplineList]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "奖惩记录列表获取失败")
      );
    }
  }

  /**
   * 删除奖惩记录
   * @param id 奖惩记录ID
   */
  public async deleteDiscipline(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.Discipline.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deleteDiscipline]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }
}
