import { TASK_REWARD_TYPE, TASK_STATUS, TASK_TYPE } from '../constants';

export type TaskReward =
  | {
      type: TASK_REWARD_TYPE.POINTS;
      value: number;
    }
  | {
      type: TASK_REWARD_TYPE.CASH_DISCOUNT;
      value: number;
      minimumOrderValue: number;
    }
  | {
      type: TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT;
      value: number;
    };

export interface TaskEntity {
  id: string;
  name: string;
  desc: string;
  type: TASK_TYPE;
  category_id: string;
  status: TASK_STATUS;
  reward: TaskReward;
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
