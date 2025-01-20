import { format } from 'date-fns';
import { computed, makeObserver, observable } from '@shared/utils/observer';
import { COUPON_STATUS, COUPON_TYPE } from '../constants';
import {
  CouponEntity,
  CouponValidityDateList,
  CouponValidityDateRange,
  CouponValidityTime,
  CouponValidityWeekly,
} from '../entity';

const isDateRange = (validityTime: CouponValidityTime): validityTime is CouponValidityDateRange => {
  return 'start_time' in validityTime && 'end_time' in validityTime;
};

const isDateList = (validityTime: CouponValidityTime): validityTime is CouponValidityDateList => {
  return 'dates' in validityTime;
};

const isWeekly = (validityTime: CouponValidityTime): validityTime is CouponValidityWeekly => {
  return 'days' in validityTime;
};

const numberToWeekday = (num: number) => {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return weekdays[num % 7];
};

export class CouponModel {
  id: string;

  name: string;

  userId: string;

  createTime: number;

  @observable
  validityTime: CouponValidityTime;

  @observable
  status: COUPON_STATUS;

  type: COUPON_TYPE;

  value: number;

  minimumOrderValue: number;

  constructor(entity: CouponEntity) {
    makeObserver(this);
    const {
      id,
      name,
      user_id,
      create_time,
      validity_time,
      status,
      type,
      value,
      minimum_order_value,
    } = entity;
    this.id = id;
    this.name = name;
    this.userId = user_id;
    this.createTime = create_time;
    this.validityTime = validity_time;
    this.status = status;
    this.type = type;
    this.value = value;
    this.minimumOrderValue = minimum_order_value;
  }
  get usageScopeTip() {
    return '全场商品可用';
  }

  get discountTip() {
    if (this.type === COUPON_TYPE.CASH_DISCOUNT) {
      return `${this.value}`;
    }
    return `${this.value / 10}折`;
  }

  get conditionTip() {
    if (this.minimumOrderValue === 0) {
      return '无门槛';
    }
    return `满${this.minimumOrderValue}可用`;
  }

  @computed
  get expirationTip() {
    const now = new Date().getTime();
    if (isDateRange(this.validityTime)) {
      const { start_time, end_time } = this.validityTime;
      return start_time <= now
        ? `有效期至：${format(end_time, 'yyyy-MM-dd')}`
        : `有效期：${format(start_time, 'yyyy-MM-dd')} ~ ${format(end_time, 'yyyy-MM-dd')}`;
    }
    if (isDateList(this.validityTime) && this.validityTime.dates.length) {
      const { dates } = this.validityTime;
      const datesInfo = dates
        .sort((a, b) => a - b)
        .map(date => format(date, 'yyyy-MM-dd'))
        .join(', ');
      return `有效期：${datesInfo}`;
    }
    if (isWeekly(this.validityTime)) {
      const { days } = this.validityTime;
      const daysInfo = days
        .sort((a, b) => a - b)
        .map(day => numberToWeekday(day))
        .join('、');
      return `有效期：每周${daysInfo}`;
    }

    return '';
  }

  @computed
  get isUsed() {
    return this.status === COUPON_STATUS.USED;
  }

  @computed
  get isExpired() {
    if (isWeekly(this.validityTime)) {
      return false;
    }
    const now = new Date().getTime();
    if (isDateRange(this.validityTime)) {
      return this.validityTime.end_time < now;
    }
    if (isDateList(this.validityTime)) {
      const { dates } = this.validityTime;
      return !dates.some(date => date >= now);
    }

    return true;
  }

  getDiscountInfo(score: number) {
    switch (true) {
      case this.status !== COUPON_STATUS.ACTIVE:
      case score < this.minimumOrderValue:
      case this.isExpired:
        return {
          score: 0,
          enabled: false,
        };
      case this.type === COUPON_TYPE.CASH_DISCOUNT:
        return {
          score: Math.min(this.value, score),
          enabled: true,
        };
      case this.type === COUPON_TYPE.PERCENTAGE_DISCOUNT:
        return {
          score: Math.min(Math.round(((100 - this.value) * score) / 100), score),
          enabled: true,
        };
      default:
        return {
          score: 0,
          enabled: false,
        };
    }
  }
}
