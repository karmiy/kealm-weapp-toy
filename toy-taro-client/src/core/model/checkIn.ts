import { computed, makeObserver, observable } from '@shared/utils/observer';
import { CHECK_IN_RULE_REWARD_TYPE, CHECK_IN_RULE_TYPE } from '../constants';
import { CheckInEntity, CheckInRule } from '../entity';

const RULE_TYPE_PRIORITY: Record<CHECK_IN_RULE_TYPE, number> = {
  [CHECK_IN_RULE_TYPE.CUMULATIVE]: 0, // 优先级高
  [CHECK_IN_RULE_TYPE.STREAK]: 1, // 优先级低
};

export class CheckInModel {
  id: string;

  userId: string;

  @observable
  days: number[];

  @observable
  rules: CheckInRule[];

  constructor(entity: CheckInEntity) {
    makeObserver(this);
    const { id, user_id, days, rules } = entity;
    this.id = id;
    this.userId = user_id;
    this.days = days;
    this.rules = rules;
  }

  @computed
  get ruleList() {
    const rules = this.rules.sort((a, b) => {
      // 先按 value 升序排序
      if (a.value !== b.value) {
        return a.value - b.value;
      }
      // 再按 type 优先级排序
      return RULE_TYPE_PRIORITY[a.type] - RULE_TYPE_PRIORITY[b.type];
    });
    return rules.map(rule => {
      const status =
        rule.type === CHECK_IN_RULE_TYPE.CUMULATIVE
          ? this.getCumulativeCheckInStatus(rule.value)
          : this.getStreakCheckInStatus(rule.value);
      return {
        ...rule,
        ruleTip: this.getRuleTip(rule),
        rewardTip: this.getRewardTip(rule),
        isClaimed: rule.reward.is_claimed, // 是否已领取
        // 是否满足签到条件
        ...status,
      };
    });
  }

  @computed
  get sortedDays() {
    return [...new Set([...this.days].sort((a, b) => a - b))];
  }

  @computed
  get markDates() {
    return this.sortedDays.map(day => {
      const date = new Date();
      date.setDate(day);
      return date;
    });
  }

  getRuleTip(rule: CheckInRule) {
    switch (rule.type) {
      case CHECK_IN_RULE_TYPE.CUMULATIVE:
        return `累计签到${rule.value}天`;
      case CHECK_IN_RULE_TYPE.STREAK:
        return `连续签到${rule.value}天`;
      default:
        return '';
    }
  }

  getRewardTip(rule: CheckInRule) {
    const reward = rule.reward;

    switch (reward.type) {
      case CHECK_IN_RULE_REWARD_TYPE.POINTS:
        return `${reward.value}积分`;
      case CHECK_IN_RULE_REWARD_TYPE.CASH_DISCOUNT:
        return `满${reward.minimumOrderValue}减${reward.value}积分优惠券`;
      case CHECK_IN_RULE_REWARD_TYPE.PERCENTAGE_DISCOUNT:
        return `${reward.value / 10}折优惠券`;
      default:
        return '';
    }
  }

  getCumulativeCheckInStatus(n: number) {
    const total = this.sortedDays.length;
    return {
      target: n,
      current: total,
      isSatisfied: total >= n,
    };
  }

  @computed
  get cumulativeCheckInDays() {
    return this.sortedDays.length;
  }

  @computed
  get streakCheckInDays() {
    const sortedDays = this.sortedDays;
    if (sortedDays.length === 0) {
      return 0;
    }

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDays.length; i++) {
      // 如果当前数字与前一个数字连续
      if (sortedDays[i] === sortedDays[i - 1] + 1) {
        currentStreak++;
      } else {
        // 如果不是连续的，重置当前连续数字的计数
        currentStreak = 1;
      }

      // 更新最大连续数
      maxStreak = Math.max(maxStreak, currentStreak);
    }
    return maxStreak;
  }

  getStreakCheckInStatus(n: number) {
    const sortedDays = this.sortedDays;

    if (sortedDays.length === 0) {
      return { target: n, current: 0, isSatisfied: false };
    }

    let maxStreak = 1;
    let currentStreak = 1;
    let hasStreakOfN = false;

    for (let i = 1; i < sortedDays.length; i++) {
      // 如果当前数字与前一个数字连续
      if (sortedDays[i] === sortedDays[i - 1] + 1) {
        currentStreak++;
      } else {
        // 如果不是连续的，重置当前连续数字的计数
        currentStreak = 1;
      }

      // 更新最大连续数
      maxStreak = Math.max(maxStreak, currentStreak);

      // 检查是否满足预期连续的数量
      if (currentStreak >= n) {
        hasStreakOfN = true;
      }
    }

    return {
      target: n,
      current: maxStreak,
      isSatisfied: hasStreakOfN,
    };
  }
}
