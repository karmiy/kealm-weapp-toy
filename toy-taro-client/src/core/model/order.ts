import { format } from 'date-fns';
import { computed, makeObserver, observable } from '@shared/utils/observer';
import { ORDER_STATUS } from '../constants';
import { OrderEntity } from '../entity';

export class OrderModel {
  id: string;

  name: string;

  desc?: string;

  score: number;

  coverImage: string;

  @observable
  createTime: number;

  lastModifiedTime: number;

  @observable
  status: ORDER_STATUS;

  userId: string;

  constructor(entity: OrderEntity) {
    makeObserver(this);
    const { id, name, desc, score, cover_image, create_time, last_modified_time, status, user_id } =
      entity;
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.score = score;
    this.coverImage = cover_image;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
    this.status = status;
    this.userId = user_id;
  }

  @computed
  get isRevoking() {
    return this.status === ORDER_STATUS.Revoking;
  }

  @computed
  get orderTime() {
    return format(this.createTime, 'yyyy-MM-dd');
  }
}
