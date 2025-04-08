import { Controller } from "egg";
import { Logger } from "../utils/logger";
import { DISCIPLINE_TYPE, SERVER_CODE } from "../utils/constants";
import { DisciplineModel } from "../model/discipline";
import { DisciplineEntity } from "../entity/discipline";

const logger = Logger.getLogger("[DisciplineController]");

export default class DisciplineController extends Controller {
  private _disciplineModelToEntity(model: DisciplineModel): DisciplineEntity {
    const { ctx } = this;
    const entity: DisciplineEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        user_id: model.user_id,
        prize_id: model.prize_id,
        type: model.type,
        reason: model.reason,
        operator_id: model.operator_id,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
      },
      {
        ignoreList: [undefined, null],
      }
    );

    return entity;
  }

  /**
   * 创建奖惩记录
   */
  public async createDiscipline() {
    const { ctx } = this;
    try {
      // 获取请求参数
      const params = ctx.getParams<{
        userId?: string;
        prizeId?: string;
        type?: DISCIPLINE_TYPE;
        reason?: string;
      }>();

      const { userId, prizeId, type, reason } = params;

      // 参数校验
      if (!userId) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "用户ID不能为空",
        });
        return;
      }

      if (!prizeId) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖惩项目ID不能为空",
        });
        return;
      }

      if (!type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖惩类型不能为空",
        });
        return;
      }

      if (!reason) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖惩原因不能为空",
        });
        return;
      }

      // 验证用户是否存在
      const user = await ctx.service.user.findUserById(userId);
      if (!user) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "用户不存在",
        });
        return;
      }

      // 验证奖品/惩罚是否存在
      const prize = await ctx.service.prize.findPrize({ id: prizeId });
      if (!prize) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖惩项目不存在",
        });
        return;
      }

      // 创建奖惩记录并执行相应操作
      const model = await ctx.service.discipline.createDiscipline({
        user_id: userId,
        prize_id: prizeId,
        type,
        reason,
      });

      if (!model) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "创建奖惩记录失败",
        });
        return;
      }

      // 返回创建的实体
      const entity = this._disciplineModelToEntity(model);
      logger.tag("[createDiscipline]").info("创建奖惩记录成功", entity);

      ctx.responseSuccess({
        data: entity,
        message: "奖惩操作成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  /**
   * 获取奖惩记录列表
   */
  public async getDisciplineList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.discipline.getDisciplineList();

      const disciplineList: DisciplineEntity[] = list.map((item) =>
        this._disciplineModelToEntity(item)
      );
      logger.tag("[getDisciplineList]").info("list", disciplineList);

      ctx.responseSuccess({
        data: disciplineList,
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
