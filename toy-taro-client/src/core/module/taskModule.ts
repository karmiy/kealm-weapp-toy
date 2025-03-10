import { TaskApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME, TASK_STATUS } from '../constants';
import { storeManager } from '../storeManager';
import { TaskUpdateParams } from '../types';

export class TaskModule extends AbstractModule {
  protected onLoad() {
    this.syncTaskList();
    this.syncTaskFlowList();
    this.syncTaskCategoryList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.TASK;
  }

  async syncTaskList() {
    storeManager.startLoading(STORE_NAME.TASK);
    const taskList = await TaskApi.getTaskList();
    storeManager.refresh(STORE_NAME.TASK, taskList);
    storeManager.stopLoading(STORE_NAME.TASK);
  }

  async syncTaskFlowList() {
    storeManager.startLoading(STORE_NAME.TASK_FLOW);
    const taskFlowList = await TaskApi.getTaskFlowList();
    storeManager.refresh(STORE_NAME.TASK_FLOW, taskFlowList);
    storeManager.stopLoading(STORE_NAME.TASK_FLOW);
  }

  async syncTaskCategoryList() {
    storeManager.startLoading(STORE_NAME.TASK_CATEGORY);
    const taskCategoryLList = await TaskApi.getTaskCategoryList();
    storeManager.refresh(STORE_NAME.TASK_CATEGORY, taskCategoryLList);
    storeManager.stopLoading(STORE_NAME.TASK_CATEGORY);
  }

  async submitApprovalRequest(id: string, taskFlowId?: string) {
    try {
      this._logger.info('submitApprovalRequest', {
        taskId: id,
        taskFlowId,
      });
      const taskFlow = await TaskApi.submitApprovalRequest(id, taskFlowId);
      storeManager.emitUpdate(STORE_NAME.TASK_FLOW, {
        entities: [taskFlow],
      });
    } catch (error) {
      this._logger.error('submitApprovalRequest error', error.message);
      throw error;
    }
  }

  async updateTaskFlowStatus(taskFlowId: string, taskId: string, status: TASK_STATUS) {
    try {
      this._logger.info('updateTaskFlowStatus', { taskFlowId, status });
      await TaskApi.updateTaskFlowStatus(taskFlowId, taskId, status);
      storeManager.emitUpdate(STORE_NAME.TASK_FLOW, {
        partials: [
          {
            id: taskFlowId,
            status,
            last_modified_time: new Date().getTime(),
            approver_id: this._sdk.modules.user.getLocalUserInfo()?.id,
          },
        ],
      });
    } catch (error) {
      this._logger.error('updateTaskFlowStatus error', error.message);
      throw error;
    }
  }

  async updateTask(task: TaskUpdateParams) {
    try {
      const { id, name, desc, type, categoryId, difficulty, prizeId } = task;
      this._logger.info('updateTask', task);
      const entity = await TaskApi.updateTask({
        id,
        name,
        desc,
        type,
        category_id: categoryId,
        difficulty,
        prize_id: prizeId,
      });
      this._logger.info('updateTask end', entity);
      storeManager.emitUpdate(STORE_NAME.TASK, {
        entities: [entity],
      });
    } catch (error) {
      this._logger.info('updateTask error', error.message);
      throw error;
    }
  }

  async updateTaskCategory(taskCategory: { id?: string; name: string }) {
    try {
      this._logger.info('updateTaskCategory', taskCategory);
      const entity = await TaskApi.updateTaskCategory(taskCategory);
      storeManager.emitUpdate(STORE_NAME.TASK_CATEGORY, {
        entities: [entity],
      });
    } catch (error) {
      this._logger.info('updateTaskCategory error', error.message);
      throw error;
    }
  }

  async deleteTask(id: string) {
    try {
      this._logger.info('deleteTask', id);
      await TaskApi.deleteTask(id);
      storeManager.emitDelete(STORE_NAME.TASK, [id]);
    } catch (error) {
      this._logger.info('deleteTask error', error.message);
      throw error;
    }
  }

  async deleteTaskCategory(id: string) {
    try {
      this._logger.info('deleteTaskCategory', id);
      await TaskApi.deleteTaskCategory(id);
      storeManager.emitDelete(STORE_NAME.TASK_CATEGORY, [id]);
    } catch (error) {
      this._logger.info('deleteTaskCategory error', error.message);
      throw error;
    }
  }
}
