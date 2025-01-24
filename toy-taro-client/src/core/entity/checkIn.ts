import { CHECK_IN_RULE_REWARD_TYPE, CHECK_IN_RULE_TYPE } from '../constants';

export interface CheckInRule {
  id: string;
  type: CHECK_IN_RULE_TYPE;
  value: number;
  reward:
    | {
        type: CHECK_IN_RULE_REWARD_TYPE.POINTS;
        value: number;
        is_claimed: boolean;
      }
    | {
        type: CHECK_IN_RULE_REWARD_TYPE.CASH_DISCOUNT;
        value: number;
        minimumOrderValue: number;
        is_claimed: boolean;
      }
    | {
        type: CHECK_IN_RULE_REWARD_TYPE.PERCENTAGE_DISCOUNT;
        value: number;
        is_claimed: boolean;
      };
}

export interface CheckInEntity {
  id: string;
  user_id: string;
  days: number[];
  rules: CheckInRule[];
}
