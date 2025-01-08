// Entity 与 Model 字段需要是下划线 -> 驼峰的关系
export interface ToyEntity {
  id: string;
  name: string;
  desc: string;
}

export interface UserEntity {
  id: string;
  name: string;
}
