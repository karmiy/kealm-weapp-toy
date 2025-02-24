import { computed, makeObserver, observable } from '@shared/utils/observer';
import { PRIZE_TYPE } from '../constants';
import { CouponEntity, PrizeEntity } from '../entity';
import { CouponModel } from './coupon';

export class PrizeModel {
  id: string;

  type: PRIZE_TYPE;

  points?: number;

  coupon?: CouponEntity;

  sortValue: number;

  @observable
  createTime: number;

  @observable
  lastModifiedTime: number;

  constructor(entity: PrizeEntity) {
    makeObserver(this);
    const { id, type, points, coupon, sort_value, create_time, last_modified_time } = entity;
    this.id = id;
    this.type = type;
    this.points = points;
    this.coupon = coupon;
    this.sortValue = sort_value;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
  }

  @computed
  get prizeTitle() {
    if (this.type === PRIZE_TYPE.POINTS) {
      return '积分奖励';
    }
    if (this.type === PRIZE_TYPE.COUPON) {
      return '优惠券奖励';
    }
    return '谢谢惠顾';
  }

  @computed
  get prizeDesc() {
    if (this.type === PRIZE_TYPE.POINTS && this.points) {
      return `${this.points}积分`;
    }
    if (this.type === PRIZE_TYPE.COUPON && this.coupon) {
      const couponModel = new CouponModel(this.coupon);
      return couponModel.descriptionTip;
    }
    return '';
  }
}
