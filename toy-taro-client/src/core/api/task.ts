import { sleep } from '@shared/utils/utils';
import { TaskCategoryEntity, TaskEntity, TaskFlowEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class TaskApi {
  @mock({ name: MOCK_API_NAME.GET_TASK_LIST })
  static async getTaskList(): Promise<TaskEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_TASK_FLOW_LIST })
  static async getTaskFlowList(): Promise<TaskFlowEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_TASK_CATEGORY_LIST })
  static async getTaskCategoryList(): Promise<TaskCategoryEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.SUBMIT_APPROVAL_REQUEST })
  static async submitApprovalRequest(id: string): Promise<TaskFlowEntity> {
    await sleep(800);
    return Math.random() > 0.5 ? Promise.resolve({} as TaskFlowEntity) : Promise.reject();
  }

  @mock({ name: MOCK_API_NAME.APPROVE_TASK })
  static async approveTask(taskFlowId: string): Promise<void> {
    await sleep(800);
    return Promise.resolve();
  }

  @mock({ name: MOCK_API_NAME.REJECT_TASK })
  static async rejectTask(taskFlowId: string): Promise<void> {
    await sleep(800);
    return Promise.resolve();
  }
}
