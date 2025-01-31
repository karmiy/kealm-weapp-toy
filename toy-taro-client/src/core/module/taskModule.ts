import { TaskApi } from '../api';
import { AbstractModule, UserStorageManager } from '../base';
import { MODULE_NAME, STORE_NAME, TASK_STATUS } from '../constants';
import { storeManager } from '../storeManager';

export class TaskModule extends AbstractModule {
  protected onLoad() {
    const isAdmin = UserStorageManager.getInstance().isAdmin;
    this.syncTaskList();
    !isAdmin && this.syncTaskFlowList();
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

  async submitApprovalRequest(id: string) {
    try {
      this._logger.info('submitApprovalRequest', 'taskId', id);
      const taskFlow = await TaskApi.submitApprovalRequest(id);
      storeManager.emitUpdate(STORE_NAME.TASK_FLOW, {
        entities: [taskFlow],
      });
    } catch (error) {
      this._logger.error('submitApprovalRequest error', error.message);
      throw error;
    }
  }

  async updateTaskFlowStatus(taskFlowId: string, status: TASK_STATUS) {
    try {
      this._logger.info('updateTaskFlowStatus', { taskFlowId, status });
      await TaskApi.updateTaskFlowStatus(taskFlowId, status);
      storeManager.emitUpdate(STORE_NAME.TASK_FLOW, {
        partials: [
          {
            id: taskFlowId,
            status,
            last_modified_time: new Date().getTime(),
          },
        ],
      });
    } catch (error) {
      this._logger.error('updateTaskFlowStatus error', error.message);
      throw error;
    }
  }
}
