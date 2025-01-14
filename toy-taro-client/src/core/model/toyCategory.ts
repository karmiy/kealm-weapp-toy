import { ToyCategoryEntity } from '../entity';

export class ToyCategoryModel {
  id: string;
  name: string;
  createTime: number;
  lastModifiedTime: number;

  constructor(entity: ToyCategoryEntity) {
    const { id, name, create_time, last_modified_time } = entity;
    this.id = id;
    this.name = name;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
  }
}
