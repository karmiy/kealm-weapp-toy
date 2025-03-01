import { computed, makeObserver, observable } from '@shared/utils/observer';
import { PRIZE_TYPE } from '../constants';
import { PrizeEntity } from '../entity';
import { CouponModel } from './coupon';

export class PrizeModel {
  id: string;

  type: PRIZE_TYPE;

  points?: number;

  couponId?: string;

  drawCount?: number;

  sortValue: number;

  @observable
  createTime: number;

  @observable
  lastModifiedTime: number;

  constructor(entity: PrizeEntity) {
    makeObserver(this);
    const { id, type, points, coupon_id, draw_count, sort_value, create_time, last_modified_time } =
      entity;
    this.id = id;
    this.type = type;
    this.points = points;
    this.couponId = coupon_id;
    this.drawCount = draw_count;
    this.sortValue = sort_value;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
  }

  @computed
  get title() {
    if (this.type === PRIZE_TYPE.POINTS) {
      return '积分奖励';
    }
    if (this.type === PRIZE_TYPE.COUPON) {
      return '优惠券奖励';
    }
    if (this.type === PRIZE_TYPE.LUCKY_DRAW) {
      return '祈愿券奖励';
    }
    return '谢谢惠顾';
  }
}
