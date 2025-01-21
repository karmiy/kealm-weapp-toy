import { TASK_REWARD_TYPE, TASK_STATUS, TASK_TYPE } from '../constants';

export interface TaskEntity {
  id: string;
  name: string;
  desc: string;
  type: TASK_TYPE;
  category_id: string;
  status: TASK_STATUS;
  reward_type: TASK_REWARD_TYPE;
  value: number;
  difficulty: number;
  user_id: string;
  create_time: number;
  last_modified_time: number;
}

export interface TaskCategoryEntity {
  id: string;
  name: string;
  create_time: number;
  last_modified_time: number;
}
