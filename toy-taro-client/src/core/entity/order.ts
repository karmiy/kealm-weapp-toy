import { ORDER_STATUS } from '../constants';

export interface OrderEntity {
  id: string;
  name: string;
  desc?: string;
  score: number;
  count: number;
  cover_image: string;
  create_time: number;
  last_modified_time: number;
  status: ORDER_STATUS;
  user_id: string;
}
