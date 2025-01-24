import { computed, makeObserver, observable } from '@shared/utils/observer';
import { TASK_REWARD_TYPE, TASK_STATUS, TASK_TYPE } from '../constants';
import { TaskEntity, TaskReward } from '../entity';

export class TaskModel {
  id: string;

  name: string;

  desc: string;

  type: TASK_TYPE;

  categoryId: string;

  @observable
  status: TASK_STATUS;

  reward: TaskReward;

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
      reward,
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
    this.reward = reward;
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
    const reward = this.reward;
    switch (reward.type) {
      case TASK_REWARD_TYPE.POINTS:
        return `+${reward.value}积分`;
      case TASK_REWARD_TYPE.CASH_DISCOUNT:
        return `满${reward.minimumOrderValue}减${reward.value}券`;
      case TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT:
        return `${reward.value / 10}折券`;
      default:
        return '';
    }
  }
}
