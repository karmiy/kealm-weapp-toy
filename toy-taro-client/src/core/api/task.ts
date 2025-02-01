import { sleep } from '@shared/utils/utils';
import { TASK_REWARD_TYPE, TASK_STATUS } from '../constants';
import { TaskCategoryEntity, TaskEntity, TaskFlowEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export type TaskApiUpdateParams = Pick<
  TaskEntity,
  'name' | 'desc' | 'type' | 'category_id' | 'difficulty'
> & {
  id?: string;
  reward_type: TASK_REWARD_TYPE;
  value?: number;
  coupon_id?: string;
};

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

  @mock({ name: MOCK_API_NAME.UPDATE_TASK_FLOW_STATUS })
  static async updateTaskFlowStatus(taskFlowId: string, status: TASK_STATUS): Promise<void> {
    await sleep(800);
    return Promise.resolve();
  }

  @mock({ name: MOCK_API_NAME.UPDATE_TASK })
  static async updateTask(params: TaskApiUpdateParams): Promise<TaskEntity> {
    await sleep(800);
    return Promise.resolve({} as TaskEntity);
  }

  @mock({ name: MOCK_API_NAME.UPDATE_TASK_CATEGORY })
  static async updateTaskCategory(params: {
    id?: string;
    name: string;
  }): Promise<TaskCategoryEntity> {
    await sleep(800);
    return Promise.resolve({} as TaskCategoryEntity);
  }

  @mock({ name: MOCK_API_NAME.DELETE_TASK })
  static async deleteTask(id: string): Promise<void> {
    return Promise.resolve();
  }

  @mock({ name: MOCK_API_NAME.DELETE_TASK_CATEGORY })
  static async deleteTaskCategory(id: string): Promise<void> {
    return Promise.resolve();
  }
}
