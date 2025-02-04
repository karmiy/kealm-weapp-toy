import {
  CHECK_IN_RULE_REWARD_TYPE,
  CHECK_IN_RULE_TYPE,
} from "../utils/constants";

export interface CheckInRule {
  id: string;
  type: CHECK_IN_RULE_TYPE;
  value: number;
  reward: {
    type: CHECK_IN_RULE_REWARD_TYPE.POINTS;
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
