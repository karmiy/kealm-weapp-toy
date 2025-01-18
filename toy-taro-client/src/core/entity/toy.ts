export interface ToyEntity {
  id: string;
  name: string;
  desc?: string;
  discounted_score?: number; // 优惠价
  original_score: number; // 原价
  stock: number; // 库存数量
  cover_image: string; // 封面图
  create_time: number; // 创建时间
  flash_sale_start?: number; // 限时特惠开始时间
  flash_sale_end?: number; // 限时特惠结束时间
  category_id: string;
}

export interface ToyCategoryEntity {
  id: string;
  name: string;
  create_time: number;
  last_modified_time: number;
}

export interface ToyShopCartEntity {
  id: string;
  product_id: string;
  user_id: string;
  create_time: number;
  last_modified_time: number;
  quantity: number;
}
