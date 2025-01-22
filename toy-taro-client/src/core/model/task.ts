import { computed, makeObserver, observable } from '@shared/utils/observer';
import { TASK_REWARD_TYPE, TASK_STATUS, TASK_TYPE } from '../constants';
import { TaskEntity } from '../entity';

export class TaskModel {
  id: string;

  name: string;

  desc: string;

  type: TASK_TYPE;

  categoryId: string;

  @observable
  status: TASK_STATUS;

  rewardType: TASK_REWARD_TYPE;

  value: number;

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
      status,
      reward_type,
      value,
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
    this.status = status;
    this.rewardType = reward_type;
    this.value = value;
    this.difficulty = difficulty;
  }

  @computed
  get isPendingApprove() {
    return this.status === TASK_STATUS.PENDING_APPROVAL;
  }

  @computed
  get isApproved() {
    return this.status === TASK_STATUS.APPROVED;
  }

  @computed
  get rewardTitle() {
    if (this.rewardType === TASK_REWARD_TYPE.POINTS) {
      return `+${this.value}积分`;
    }
    return `${this.value / 10}折券`;
  }
}
