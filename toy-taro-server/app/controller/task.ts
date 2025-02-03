import { Controller } from "egg";
import { Logger } from "../utils/logger";
import {
  COUPON_TYPE,
  SERVER_CODE,
  TASK_REWARD_TYPE,
  TASK_STATUS,
  TASK_TYPE,
} from "../utils/constants";
import {
  TaskCategoryEntity,
  TaskEntity,
  TaskFlowEntity,
  TaskReward,
} from "../entity/task";
import { TaskCategoryModel } from "../model/taskCategory";
import { CouponModel } from "../model/coupon";
import { TaskModel } from "../model/task";
import { JsError } from "../utils/error";
import { TaskFlowModel } from "../model/taskFlow";

const logger = Logger.getLogger("[TaskController]");

export default class TaskController extends Controller {
  private _taskCategoryModelToEntity(model: TaskCategoryModel) {
    const { ctx } = this;
    const entity: TaskCategoryEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        name: model.name,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
      },
      {
        ignoreList: [0, undefined],
      }
    );

    return entity;
  }

  private _taskModelToEntity(model: TaskModel) {
    const { ctx } = this;
    const reward = {
      type: model.reward_type,
    } as TaskReward;
    if (reward.type === TASK_REWARD_TYPE.POINTS) {
      reward.value = model.reward_value;
    }
    if (
      reward.type === TASK_REWARD_TYPE.CASH_DISCOUNT ||
      reward.type === TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT
    ) {
      if (!model.reward_coupon_id) {
        throw new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "优惠券不存在");
      }
      reward.couponId = model.reward_coupon_id;
      reward.value = model.reward_value;
      reward.minimumOrderValue = model.reward_minimum_order_value ?? 0;
    }
    const entity: TaskEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        name: model.name,
        desc: model.description,
        type: model.type,
        category_id: model.category_id,
        reward,
        difficulty: model.difficulty,
        user_id: model.user_id,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
      },
      {
        ignoreList: [undefined],
      }
    );
    return entity;
  }

  private _taskFlowModelToEntity(model: TaskFlowModel) {
    const { ctx } = this;
    const entity: TaskFlowEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        task_id: model.task_id,
        status: model.status,
        user_id: model.user_id,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
      },
      {
        ignoreList: [undefined],
      }
    );
    return entity;
  }

  public async updateTaskCategory() {
    const { ctx } = this;
    try {
      const { id, name } = ctx.getParams<{ id?: string; name: string }>();
      logger.tag("[updateTaskCategory]").info("params", { id, name });

      if (!name) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少分类名称",
        });
        return;
      }

      if (id) {
        const model = await ctx.service.task.findTaskCategory({ id });
        if (!model) {
          ctx.responseFail({
            code: SERVER_CODE.BAD_REQUEST,
            message: "分类不存在",
          });
          return;
        }
      }

      const data = await ctx.service.task.upsertTaskCategory({
        id,
        name,
      });

      if (!data) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取分类异常",
        });
        return;
      }

      const entity = this._taskCategoryModelToEntity(data);

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

  public async getTaskCategoryList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.task.getTaskCategoryList();

      const categoryList: TaskCategoryEntity[] = list.map((item) =>
        this._taskCategoryModelToEntity(item)
      );
      logger.tag("[getTaskCategoryList]").info("list", categoryList);

      ctx.responseSuccess({
        data: categoryList,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async deleteTaskCategory() {
    const { ctx } = this;
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少分类 id",
        });
        return;
      }
      const taskCategoryModel = await ctx.service.task.findTaskCategory({
        id,
      });

      if (!taskCategoryModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "分类不存在",
        });
        return;
      }
      // 检查分类下是否存在任务
      const taskModel = await ctx.service.task.findTask({
        category_id: id,
      });
      if (taskModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "无法删除，分类下存在任务",
        });
        return;
      }
      await ctx.service.task.deleteTaskCategory(id);
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

  public async updateTask() {
    const { ctx } = this;
    const { userId, groupId } = ctx.getUserInfo();
    try {
      const params = ctx.getParams<{
        id?: string;
        name: string;
        desc: string;
        type: TASK_TYPE;
        category_id: string;
        difficulty: number;
        reward_type: TASK_REWARD_TYPE;
        value?: number;
        coupon_id?: string;
      }>();

      const {
        id,
        name,
        desc,
        type,
        category_id,
        difficulty,
        reward_type,
        value,
        coupon_id,
      } = params;

      logger.tag("[updateTask]").info(params);

      if (!name) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务名称不能为空",
        });
        return;
      }

      if (!desc) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务描述不能为空",
        });
        return;
      }

      if (!type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务类型不能为空",
        });
        return;
      }

      if (
        ![
          TASK_TYPE.DAILY,
          TASK_TYPE.WEEKLY,
          TASK_TYPE.TIMED,
          TASK_TYPE.CHALLENGE,
        ].includes(type)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务类型错误",
        });
        return;
      }

      if (!category_id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务分类不能为空",
        });
        return;
      }
      const taskCategoryModel = await ctx.service.task.findTaskCategory({
        id: category_id,
        group_id: groupId,
      });

      if (!taskCategoryModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务分类不存在",
        });
        return;
      }

      if (!difficulty) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务难度不能为空",
        });
        return;
      }

      if (!reward_type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务奖励类型不能为空",
        });
        return;
      }

      if (
        ![
          TASK_REWARD_TYPE.POINTS,
          TASK_REWARD_TYPE.CASH_DISCOUNT,
          TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT,
        ].includes(reward_type)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务奖励类型错误",
        });
        return;
      }

      if (reward_type === TASK_REWARD_TYPE.POINTS && !value) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务奖励积分不能为空",
        });
        return;
      }

      if (reward_type !== TASK_REWARD_TYPE.POINTS && !coupon_id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "优惠券不能为空",
        });
        return;
      }

      const prevTaskModel = id ? await ctx.service.task.findTask({ id }) : null;
      if (id && !prevTaskModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务不存在",
        });
        return;
      }

      let couponModel: CouponModel | null = null;

      if (reward_type !== TASK_REWARD_TYPE.POINTS) {
        couponModel = await ctx.service.coupon.findCoupon({
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

      const rewardValue =
        reward_type === TASK_REWARD_TYPE.POINTS ? value : couponModel?.value;
      const rewardType =
        reward_type === TASK_REWARD_TYPE.POINTS
          ? TASK_REWARD_TYPE.POINTS
          : couponModel?.type === COUPON_TYPE.CASH_DISCOUNT
          ? TASK_REWARD_TYPE.CASH_DISCOUNT
          : TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT;

      const taskModel = await ctx.service.task.upsertTask({
        id,
        name,
        description: desc ?? "",
        type,
        reward_type: rewardType,
        reward_value: rewardValue ?? 0,
        reward_coupon_id: coupon_id ?? null,
        reward_minimum_order_value: couponModel?.minimum_order_value ?? null,
        difficulty: difficulty ?? 0,
        category_id,
        user_id: userId,
      });

      if (!taskModel) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取任务异常",
        });
        return;
      }

      const entity = this._taskModelToEntity(taskModel);

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

  public async deleteTask() {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少任务 id",
        });
        return;
      }
      const taskModel = await ctx.service.task.findTask({
        id,
      });

      if (!taskModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务不存在",
        });
        return;
      }
      // 检查是否有 taskFlow 相关
      const taskFlowModel = await ctx.service.task.findTaskFlow({
        task_id: id,
        group_id: groupId,
        status: TASK_STATUS.PENDING_APPROVAL,
      });
      if (taskFlowModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "无法删除，存在待审批任务流",
        });
        return;
      }
      await ctx.service.task.deleteTask(id);
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

  public async getTaskList() {
    const { ctx } = this;
    try {
      // [TODO] 根据角色获取任务列表，用户的任务要看是否已完成
      const list = await ctx.service.task.getTaskList();

      const taskList: TaskEntity[] = list.map((item) =>
        this._taskModelToEntity(item)
      );
      logger.tag("[getTaskList]").info("list", taskList);

      ctx.responseSuccess({
        data: taskList,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async updateTaskFlow() {
    const { ctx } = this;
    const { userId, groupId } = ctx.getUserInfo();
    try {
      const params = ctx.getParams<{
        id?: string;
        status: TASK_STATUS;
        task_id: string;
      }>();

      const { id, status, task_id } = params;

      logger.tag("[updateTaskFlow]").info(params);

      if (id) {
        const model = await ctx.service.task.findTaskFlow({
          id,
          group_id: groupId,
          user_id: userId,
        });
        if (!model) {
          ctx.responseFail({
            code: SERVER_CODE.BAD_REQUEST,
            message: "任务流不存在",
          });
          return;
        }
      }

      if (!status) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务状态不能为空",
        });
        return;
      }

      if (
        ![
          TASK_STATUS.PENDING_APPROVAL,
          TASK_STATUS.APPROVED,
          TASK_STATUS.REJECTED,
        ].includes(status)
      ) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务状态错误",
        });
        return;
      }

      if (!task_id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务 id 不能为空",
        });
        return;
      }

      const taskModel = await ctx.service.task.findTask({
        id: task_id,
        group_id: groupId,
      });

      if (!taskModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "任务不存在",
        });
        return;
      }

      const taskFlowModel = await ctx.service.task.upsertTaskFlow({
        id,
        task_id,
        status,
      });

      if (!taskFlowModel) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取任务流异常",
        });
        return;
      }

      const entity = this._taskFlowModelToEntity(taskFlowModel);

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

  public async getTaskFlowList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.task.getTaskFlowList();

      const taskFlowList: TaskFlowEntity[] = list.map((item) =>
        this._taskFlowModelToEntity(item)
      );
      logger.tag("[getTaskFlowList]").info("list", taskFlowList);

      ctx.responseSuccess({
        data: taskFlowList,
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
