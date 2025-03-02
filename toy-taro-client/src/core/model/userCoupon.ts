import { makeObserver, observable } from '@shared/utils/observer';
import { COUPON_STATUS } from '../constants';
import { UserCouponEntity } from '../entity';

export class UserCouponModel {
  id: string;

  couponId: string;

  userId: string;

  createTime: number;

  lastModifiedTime: number;

  @observable
  status: COUPON_STATUS;

  constructor(entity: UserCouponEntity) {
    makeObserver(this);
    const { id, coupon_id, user_id, create_time, last_modified_time, status } = entity;
    this.id = id;
    this.couponId = coupon_id;
    this.userId = user_id;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
    this.status = status;
  }
}
