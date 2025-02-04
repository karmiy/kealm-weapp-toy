import { Controller } from "egg";
import { Logger } from "../utils/logger";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { Op } from "sequelize";
import {
  CHECK_IN_RULE_REWARD_TYPE,
  CHECK_IN_RULE_TYPE,
  SERVER_CODE,
} from "../utils/constants";
import { CheckInEntity } from "../entity/checkIn";

const logger = Logger.getLogger("[CheckInController]");

export default class CheckInController extends Controller {
  public async checkInToday() {
    const { ctx } = this;
    try {
      logger.tag("[checkInToday]").info("checkInToday");

      const { groupId, userId } = ctx.getUserInfo();
      const today = new Date();
      const startOfTodayDay = startOfDay(today);
      const endOfTodayDay = endOfDay(today);

      const userCheckIn = await ctx.service.checkIn.findUserCheckIn({
        user_id: userId,
        group_id: groupId,
        create_time: {
          [Op.between]: [startOfTodayDay, endOfTodayDay],
        },
      });

      if (userCheckIn) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "今天已签到",
        });
        return;
      }

      await ctx.service.checkIn.createUserCheckIn({});

      ctx.responseSuccess({
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

  public async createCheckInRule() {
    const { ctx } = this;
    try {
      const params = ctx.getParams<{
        type?: CHECK_IN_RULE_TYPE;
        value?: number;
        reward_type?: CHECK_IN_RULE_REWARD_TYPE;
        reward_value?: number;
      }>();

      logger.tag("[createCheckInRule]").info("createCheckInRule", params);
      const { type, value, reward_type, reward_value } = params;

      if (!type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "签到类型不能为空",
        });
        return;
      }

      if (
        ![CHECK_IN_RULE_TYPE.CUMULATIVE, CHECK_IN_RULE_TYPE.STREAK].includes(
          type
        )
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "签到类型错误",
        });
        return;
      }

      if (!value) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "签到天数不能为空",
        });
        return;
      }

      if (!reward_type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖励类型不能为空",
        });
        return;
      }

      if (![CHECK_IN_RULE_REWARD_TYPE.POINTS].includes(reward_type)) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖励类型错误",
        });
        return;
      }

      if (!reward_value) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖励值不能为空",
        });
        return;
      }

      await ctx.service.checkIn.createCheckInRule({
        type,
        value,
        reward_type,
        reward_value,
      });

      ctx.responseSuccess({
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

  public async claimReward() {
    const { ctx } = this;
    try {
      const params = ctx.getParams<{
        rule_id?: string;
      }>();
      const { userId } = ctx.getUserInfo();

      logger.tag("[claimReward]").info("claimReward", params);
      const { rule_id } = params;

      if (!rule_id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "签到规则 id 不能为空",
        });
        return;
      }

      const checkInRule = await ctx.service.checkIn.findCheckInRule({
        id: rule_id,
      });

      if (!checkInRule) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "签到规则不存在",
        });
        return;
      }

      // 判断是否已领取
      const today = new Date();
      const startOfTMonthDay = startOfMonth(today);
      const endOfMonthDay = endOfMonth(today);
      const userCheckInRule = await ctx.service.checkIn.findUserCheckInRule({
        rule_id,
        create_time: {
          [Op.between]: [startOfTMonthDay, endOfMonthDay],
        },
      });

      if (userCheckInRule) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "已领取",
        });
        return;
      }

      // 创建
      await ctx.service.checkIn.createUserCheckInRule({
        rule_id,
      });

      // 领取奖励
      if (checkInRule.reward_type === CHECK_IN_RULE_REWARD_TYPE.POINTS) {
        const addedScore = checkInRule.reward_value ?? 0;
        const user = await ctx.service.user.findUserById(userId);
        await ctx.service.user.updateUserById(userId, {
          score: user.score + addedScore,
        });
      }

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

  public async getCheckInList() {
    const { ctx } = this;
    const { userId } = ctx.getUserInfo();
    try {
      logger.tag("[getCheckInList]").info("getCheckInList");

      const today = new Date();
      const startOfTMonthDay = startOfMonth(today);
      const endOfMonthDay = endOfMonth(today);

      // 获取用户本月签到记录
      const userCheckInList = await ctx.service.checkIn.getUserCheckInList({
        create_time: {
          [Op.between]: [startOfTMonthDay, endOfMonthDay],
        },
      });
      const days = new Set<number>();
      userCheckInList.forEach((item) => {
        days.add(item.create_time.getDate());
      });

      // 获取规则列表与领取状态
      const checkInRuleList =
        await ctx.service.checkIn.getCheckInRuleListWithStatus(today);

      const rules = checkInRuleList.map((item) => {
        return {
          id: item.id,
          type: item.type,
          value: item.value,
          reward: {
            type: item.reward_type,
            value: item.reward_value,
            is_claimed: !!item.get().status,
          },
        };
      });

      const entity: CheckInEntity = {
        id: "1",
        user_id: userId,
        days: [...days],
        rules,
      };

      ctx.responseSuccess({
        data: entity,
        message: "请求成功",
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
