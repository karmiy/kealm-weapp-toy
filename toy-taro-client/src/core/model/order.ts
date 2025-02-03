import { format } from 'date-fns';
import { computed, makeObserver, observable } from '@shared/utils/observer';
import { ORDER_STATUS } from '../constants';
import { OrderEntity } from '../entity';

export class OrderModel {
  id: string;

  products: Array<{
    id: string;
    name: string;
    desc?: string;
    count: number;
    cover_image: string;
  }>;

  score: number;

  discountScore?: number;

  couponId?: string;

  @observable
  createTime: number;

  @observable
  lastModifiedTime: number;

  @observable
  status: ORDER_STATUS;

  userId: string;

  constructor(entity: OrderEntity) {
    makeObserver(this);
    const {
      id,
      products,
      score,
      discount_score,
      coupon_id,
      create_time,
      last_modified_time,
      status,
      user_id,
    } = entity;
    this.id = id;
    this.products = products;
    this.score = score;
    this.discountScore = discount_score;
    this.couponId = coupon_id;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
    this.status = status;
    this.userId = user_id;
  }

  @computed
  get isRevoking() {
    return this.status === ORDER_STATUS.REVOKING;
  }

  @computed
  get isApproved() {
    return this.status === ORDER_STATUS.APPROVED;
  }

  @computed
  get isRejected() {
    return this.status === ORDER_STATUS.REJECTED;
  }

  @computed
  get orderTime() {
    return format(this.createTime, 'yyyy-MM-dd HH:mm:ss');
  }

  @computed
  get operateTime() {
    return format(this.lastModifiedTime, 'yyyy-MM-dd HH:mm:s');
  }
}
