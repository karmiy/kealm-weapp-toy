import { TASK_REWARD_TYPE, TASK_STATUS } from '../constants';
import { TaskCategoryEntity, TaskEntity, TaskFlowEntity } from '../entity';
import { httpRequest } from '../httpRequest';
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
    return httpRequest.get<TaskEntity[]>({
      url: '/task/getTaskList',
    });
  }

  @mock({ name: MOCK_API_NAME.GET_TASK_FLOW_LIST })
  static async getTaskFlowList(): Promise<TaskFlowEntity[]> {
    return httpRequest.get<TaskFlowEntity[]>({
      url: '/task/getTaskFlowList',
    });
  }

  @mock({ name: MOCK_API_NAME.GET_TASK_CATEGORY_LIST })
  static async getTaskCategoryList(): Promise<TaskCategoryEntity[]> {
    return httpRequest.get<TaskCategoryEntity[]>({
      url: '/task/getTaskCategoryList',
    });
  }

  @mock({ name: MOCK_API_NAME.SUBMIT_APPROVAL_REQUEST })
  static async submitApprovalRequest(id: string, taskFlowId?: string): Promise<TaskFlowEntity> {
    return httpRequest.post<TaskFlowEntity>({
      url: '/task/updateTaskFlow',
      data: {
        id: taskFlowId,
        task_id: id,
        status: TASK_STATUS.PENDING_APPROVAL,
      },
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_TASK_FLOW_STATUS })
  static async updateTaskFlowStatus(
    taskFlowId: string,
    taskId: string,
    status: TASK_STATUS,
  ): Promise<void> {
    return httpRequest.post<void>({
      url: '/task/updateTaskFlow',
      data: {
        id: taskFlowId,
        task_id: taskId,
        status,
      },
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_TASK })
  static async updateTask(params: TaskApiUpdateParams): Promise<TaskEntity> {
    return httpRequest.post<TaskEntity>({
      url: '/task/updateTask',
      data: params,
    });
  }

  @mock({ name: MOCK_API_NAME.UPDATE_TASK_CATEGORY })
  static async updateTaskCategory(params: {
    id?: string;
    name: string;
  }): Promise<TaskCategoryEntity> {
    return httpRequest.post<TaskCategoryEntity>({
      url: '/task/updateTaskCategory',
      data: params,
    });
  }

  @mock({ name: MOCK_API_NAME.DELETE_TASK })
  static async deleteTask(id: string): Promise<void> {
    return httpRequest.post<void>({
      url: '/task/deleteTask',
      data: {
        id,
      },
    });
  }

  @mock({ name: MOCK_API_NAME.DELETE_TASK_CATEGORY })
  static async deleteTaskCategory(id: string): Promise<void> {
    return httpRequest.post<void>({
      url: '/task/deleteTaskCategory',
      data: {
        id,
      },
    });
  }
}
