import { sleep } from '@shared/utils/utils';
import { TaskCategoryEntity, TaskEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class TaskApi {
  @mock({ name: MOCK_API_NAME.GET_TASK_LIST, enable: true })
  static async getTaskList(): Promise<TaskEntity[]> {
    return Promise.resolve([]);
  }

  @mock({ name: MOCK_API_NAME.GET_TASK_CATEGORY_LIST, enable: true })
  static async getTaskCategoryList(): Promise<TaskCategoryEntity[]> {
    return Promise.resolve([]);
  }

  static async submitApprovalRequest(id: string): Promise<void> {
    await sleep(800);
    return Math.random() > 0.5 ? Promise.resolve() : Promise.reject();
  }
}
