// Entity 与 Model 字段需要是下划线 -> 驼峰的关系
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
}

export interface UserEntity {
  id: string;
  name: string;
}
