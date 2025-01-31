import { computed, makeObserver, observable } from '@shared/utils/observer';
import { TASK_REWARD_TYPE, TASK_TYPE } from '../constants';
import { TaskEntity, TaskReward } from '../entity';

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
  reward: TaskReward;

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
    this.reward = reward;
    this.difficulty = difficulty;
  }

  @computed
  get couponId() {
    if (this.reward.type === TASK_REWARD_TYPE.POINTS) {
      return;
    }
    return this.reward.couponId;
  }

  @computed
  get isCouponReward() {
    return this.reward.type !== TASK_REWARD_TYPE.POINTS;
  }

  @computed
  get pointsValue() {
    if (this.isCouponReward) {
      return;
    }
    return this.reward.value;
  }

  @computed
  get rewardTitle() {
    const reward = this.reward;
    switch (reward.type) {
      case TASK_REWARD_TYPE.POINTS:
        return `+${reward.value}积分`;
      case TASK_REWARD_TYPE.CASH_DISCOUNT:
      case TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT:
        const conditionTip = reward.minimumOrderValue
          ? `满${reward.minimumOrderValue}可用`
          : '无门槛';
        const titleTip =
          reward.type === TASK_REWARD_TYPE.CASH_DISCOUNT
            ? `减${reward.value}券`
            : `${reward.value / 10}折券`;
        return `${titleTip}(${conditionTip})`;
      default:
        return '';
    }
  }
}
