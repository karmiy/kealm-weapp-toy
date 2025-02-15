import { Service } from "egg";
import { Logger } from "../utils/logger";
import { TaskCategoryModel } from "../model/taskCategory";
import { JsError } from "../utils/error";
import { SERVER_CODE } from "../utils/constants";
import { TaskModel } from "../model/task";
import { TaskFlowModel } from "../model/taskFlow";

const logger = Logger.getLogger("[TaskService]");

/**
 * Task Service
 */
export default class Task extends Service {
  public async findTaskCategory(
    fields: Partial<TaskCategoryModel>
  ): Promise<TaskCategoryModel | null> {
    const { ctx } = this;
    const taskCategory = await ctx.model.TaskCategory.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      // raw: true,
    });
    return taskCategory as any as TaskCategoryModel;
  }

  public async findTask(fields: Partial<TaskModel>): Promise<TaskModel | null> {
    const { ctx } = this;
    const task = await ctx.model.Task.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      // raw: true,
    });
    return task as any as TaskModel;
  }

  public async findTaskFlow(
    fields: Partial<TaskFlowModel>
  ): Promise<TaskFlowModel | null> {
    const { ctx } = this;
    const taskFlow = await ctx.model.TaskFlow.findOne({
      where: {
        ...fields,
        is_deleted: 0,
      },
      // raw: true,
    });
    return taskFlow as any as TaskFlowModel;
  }

  public async upsertTaskCategory(fields: Partial<TaskCategoryModel>) {
    try {
      const { ctx } = this;
      const { groupId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.TaskCategory.upsert(
        {
          ...ctx.helper.cleanEmptyFields(fields, {
            ignoreList: [undefined],
          }),
          group_id: groupId,
        },
        {
          returning: true,
        }
      );
      const id = (upsertResponse[0] as any).id;
      if (!id) {
        logger.tag("[upsertTaskCategory]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findTaskCategory({ id });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertTaskCategory]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  async getTaskCategoryList() {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();

    const categories = await ctx.model.TaskCategory.findAll({
      where: {
        group_id: groupId,
        is_deleted: 0,
      },
      order: [["last_modified_time", "desc"]],
    });

    if (!categories) {
      logger.error("[getTaskCategoryList] cannot get task category list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return categories as any as TaskCategoryModel[];
  }

  public async deleteTaskCategory(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.TaskCategory.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deleteTaskCategory]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  public async upsertTask(fields: Partial<TaskModel>) {
    try {
      const { ctx } = this;
      const { groupId } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.Task.upsert(
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
        logger.tag("[upsertTask]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findTask({
        id,
        group_id: groupId,
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertTask]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  public async updateTasksPartial(
    fields: Partial<TaskModel>,
    where: Partial<TaskModel>
  ) {
    try {
      const { ctx } = this;
      await ctx.model.Task.update(
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
      logger.tag("[updateTasksPartial]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, `更新失败`)
      );
    }
  }

  public async deleteTask(id: string) {
    try {
      const { ctx } = this;
      await ctx.model.Task.update(
        {
          is_deleted: 1,
        },
        {
          where: { id },
          returning: true,
        }
      );
    } catch (error) {
      logger.tag("[deleteTask]").error("error", error);
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "删除失败")
      );
    }
  }

  async getTaskList() {
    const { ctx } = this;
    const { groupId } = ctx.getUserInfo();

    const tasks = await ctx.model.Task.findAll({
      where: {
        group_id: groupId,
        is_deleted: 0,
      },
      order: [["last_modified_time", "desc"]],
    });

    if (!tasks) {
      logger.error("[getTaskList] cannot get task list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return tasks as any as TaskModel[];
  }

  public async upsertTaskFlow(fields: Partial<TaskFlowModel>) {
    try {
      const { ctx } = this;
      const { groupId, userId, isAdmin } = ctx.getUserInfo();
      const upsertResponse = await ctx.model.TaskFlow.upsert(
        {
          ...fields,
          group_id: groupId,
          ...(isAdmin ? {} : { user_id: userId }),
          approver_id: isAdmin ? userId : null,
        },
        {
          returning: true,
        }
      );
      const id = (upsertResponse[0] as any).id;
      if (!id) {
        logger.tag("[upsertTaskFlow]").error("cannot get id after upsert");
        return Promise.reject(
          new JsError(
            SERVER_CODE.INTERNAL_SERVER_ERROR,
            `${fields.id ? "更新" : "创建"}失败`
          )
        );
      }
      const model = await this.findTaskFlow({
        id,
        group_id: groupId,
        ...(isAdmin ? {} : { user_id: userId }),
      });
      return Promise.resolve(model);
    } catch (error) {
      logger.tag("[upsertTaskFlow]").error("error", error);
      return Promise.reject(
        new JsError(
          SERVER_CODE.INTERNAL_SERVER_ERROR,
          `${fields.id ? "更新" : "创建"}失败`
        )
      );
    }
  }

  async getTaskFlowList() {
    const { ctx } = this;
    const { groupId, userId, isAdmin } = ctx.getUserInfo();

    const taskFlows = await ctx.model.TaskFlow.findAll({
      where: {
        group_id: groupId,
        ...(!isAdmin ? { user_id: userId } : {}),
        is_deleted: 0,
      },
      order: [["last_modified_time", "desc"]],
      include: [
        {
          model: ctx.model.Task,
          as: "task",
          required: true,
          where: {
            is_deleted: 0,
            group_id: groupId,
          },
        },
      ],
    });

    if (!taskFlows) {
      logger.error("[getTaskFlowList] cannot get task list");
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "列表获取失败"));
    }
    // 返回结果
    return taskFlows as any as TaskFlowModel[];
  }
}
