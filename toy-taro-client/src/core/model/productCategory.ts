import { ProductCategoryEntity } from '../entity';

export class ProductCategoryModel {
  id: string;
  name: string;
  createTime: number;
  lastModifiedTime: number;

  constructor(entity: ProductCategoryEntity) {
    const { id, name, create_time, last_modified_time } = entity;
    this.id = id;
    this.name = name;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
  }
}
