import { makeObserver, observable } from '@shared/utils/observer';
import { TASK_TYPE } from '../constants';
import { TaskEntity } from '../entity';

export class TaskModel {
  id: string;

  @observable
  name: string;

  @observable
  desc: string;

  @observable
  type: TASK_TYPE;

  @observable
  categoryId: string;

  @observable
  prizeId: string;

  @observable
  difficulty: number;

  userId: string;

  createTime: number;

  lastModifiedTime: number;

  constructor(entity: TaskEntity) {
    makeObserver(this);
    const {
      id,
      name,
      user_id,
      create_time,
      last_modified_time,
      desc,
      type,
      category_id,
      prize_id,
      difficulty,
    } = entity;
    this.id = id;
    this.name = name;
    this.userId = user_id;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
    this.desc = desc;
    this.type = type;
    this.categoryId = category_id;
    this.prizeId = prize_id;
    this.difficulty = difficulty;
  }
}
