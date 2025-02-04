import { Service } from "egg";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { Logger } from "../utils/logger";
import { SERVER_CODE } from "../utils/constants";
import { JsError } from "../utils/error";
import { UserCheckInModel } from "../model/userCheckIn";
import { QueryWhere } from "../utils/types";
import { CheckInRuleModel } from "../model/checkInRule";
import { UserCheckInRuleModel } from "../model/userCheckInRule";

const logger = Logger.getLogger("[CheckInService]");

/**
 * CheckIn Service
 */
export default class CheckIn extends Service {
  public async findUserCheckIn(
    fields: QueryWhere<UserCheckInModel>
  ): Promise<UserCheckInModel | null> {
    const { ctx } = this;
    const userCheckIn = await ctx.model.UserCheckIn.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      // raw: true,
    });
    return userCheckIn as any as UserCheckInModel;
  }

  public async getUserCheckInList(where?: QueryWhere<UserCheckInModel>) {
    const { ctx } = this;
    const { groupId, userId } = ctx.getUserInfo();

    const userCheckInList = await ctx.model.UserCheckIn.findAll({
      // raw: true,
      where: {
        group_id: groupId,
        user_id: userId,
        is_deleted: 0,
        ...where,
      },
      order: [["last_modified_time", "desc"]],
    });

    if (!userCheckInList) {
      logger.error("[getUserCheckInList] cannot get user check in list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return userCheckInList as any as UserCheckInModel[];
  }

  public async findCheckInRule(
    fields: QueryWhere<CheckInRuleModel>
  ): Promise<CheckInRuleModel | null> {
    const { ctx } = this;
    const checkInRule = await ctx.model.CheckInRule.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      // raw: true,
    });
    return checkInRule as any as CheckInRuleModel;
  }

  public async getCheckInRuleListWithStatus(queryDate: Date) {
    const { ctx } = this;
    const { groupId, userId } = ctx.getUserInfo();
    const startOfTMonthDay = format(
      startOfMonth(queryDate),
      "yyyy-MM-dd HH:mm:ss"
    );
    const endOfMonthDay = format(endOfMonth(queryDate), "yyyy-MM-dd HH:mm:ss");

    const checkInRuleList = await ctx.model.CheckInRule.findAll({
      where: {
        group_id: groupId,
        is_deleted: 0,
      },
      order: [["last_modified_time", "desc"]],
      attributes: {
        include: [
          [
            ctx.app.Sequelize.literal(
              `(SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END
               FROM user_check_in_rule 
               WHERE user_check_in_rule.rule_id = check_in_rule.id 
               AND user_check_in_rule.create_time BETWEEN '${startOfTMonthDay}' AND '${endOfMonthDay}' 
               AND user_check_in_rule.is_deleted = 0 
               AND user_check_in_rule.user_id = ${userId} 
               AND user_check_in_rule.group_id = ${groupId})`
            ),
            "status",
          ],
        ],
      },
    });

    if (!checkInRuleList) {
      logger.error("[getCheckInRuleList] cannot get check in rule list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return checkInRuleList as any as Array<
      CheckInRuleModel & { get: () => CheckInRuleModel & { status: number } }
    >;
  }

  public async findUserCheckInRule(
    fields: QueryWhere<UserCheckInRuleModel>
  ): Promise<UserCheckInRuleModel | null> {
    const { ctx } = this;
    const userCheckInRule = await ctx.model.UserCheckInRule.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      // raw: true,
    });
    return userCheckInRule as any as UserCheckInRuleModel;
  }

  public async getUserCheckInRuleList(
    where?: QueryWhere<UserCheckInRuleModel>
  ) {
    const { ctx } = this;
    const { groupId, userId } = ctx.getUserInfo();

    const userCheckInRuleList = await ctx.model.UserCheckInRule.findAll({
      // raw: true,
      where: {
        group_id: groupId,
        user_id: userId,
        is_deleted: 0,
        ...where,
      },
      order: [["last_modified_time", "desc"]],
    });

    if (!userCheckInRuleList) {
      logger.error(
        "[getUserCheckInRuleList] cannot get user check in rule list"
      );
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return userCheckInRuleList as any as UserCheckInRuleModel[];
  }

  public async createUserCheckIn(fields: Partial<UserCheckInModel>) {
    try {
      const { ctx } = this;
      const { groupId, userId } = ctx.getUserInfo();
      const insertResponse = await ctx.model.UserCheckIn.create(
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
        logger.tag("[createUserCheckIn]").error("cannot get id after create");
        return Promise.reject(
          new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "创建失败")
        );
      }
      const model = await this.findUserCheckIn({
        id,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[createUserCheckIn]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "创建失败")
      );
    }
  }

  public async createCheckInRule(fields: Partial<CheckInRuleModel>) {
    try {
      const { ctx } = this;
      const { groupId, userId } = ctx.getUserInfo();
      const insertResponse = await ctx.model.CheckInRule.create(
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
        logger.tag("[createCheckInRule]").error("cannot get id after create");
        return Promise.reject(
          new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "创建失败")
        );
      }
      const model = await this.findCheckInRule({
        id,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[createCheckInRule]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "创建失败")
      );
    }
  }

  public async createUserCheckInRule(fields: Partial<UserCheckInRuleModel>) {
    try {
      const { ctx } = this;
      const { groupId, userId } = ctx.getUserInfo();
      const insertResponse = await ctx.model.UserCheckInRule.create(
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
        logger
          .tag("[createUserCheckInRule]")
          .error("cannot get id after create");
        return Promise.reject(
          new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "创建失败")
        );
      }
      const model = await this.findUserCheckInRule({
        id,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[createUserCheckInRule]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "创建失败")
      );
    }
  }
}
