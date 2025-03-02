import { TASK_STATUS, TASK_TYPE } from "../utils/constants";

export interface TaskEntity {
  id: string;
  name: string;
  desc: string;
  type: TASK_TYPE;
  category_id: string;
  prize_id: string;
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

export interface TaskFlowEntity {
  id: string;
  task_id: string;
  status: TASK_STATUS;
  user_id: string;
  create_time: number;
  last_modified_time: number;
}
