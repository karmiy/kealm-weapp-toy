import { PRODUCT_ORDER_STATUS } from "../utils/constants";

export interface ProductOrderEntity {
  id: string;
  products: Array<{
    id: string;
    name: string;
    desc?: string;
    count: number;
    cover_image: string;
  }>;
  coupon_id?: string;
  discount_score?: number;
  score: number;
  create_time: number;
  last_modified_time: number;
  status: PRODUCT_ORDER_STATUS;
  user_id: string;
}
