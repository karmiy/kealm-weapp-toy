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
}
