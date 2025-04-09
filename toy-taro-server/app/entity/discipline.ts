import { DISCIPLINE_TYPE } from "../utils/constants";

export interface DisciplineEntity {
  id: string;
  user_id: string;
  prize_id: string;
  type: DISCIPLINE_TYPE;
  reason: string;
  operator_id?: string;
  create_time: number;
  last_modified_time: number;
}
