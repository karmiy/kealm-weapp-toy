import { TASK_TYPE } from "@core";

export enum TASK_REWARD_SELECT_TYPE {
  POINTS = 'POINTS',
  COUPON = 'COUPON',
}

export const TASK_TYPE_LIST = [
  { id: TASK_TYPE.DAILY, name: '每日任务' },
  { id: TASK_TYPE.WEEKLY, name: '每周任务' },
  { id: TASK_TYPE.TIMED, name: '限时任务' },
  { id: TASK_TYPE.CHALLENGE, name: '挑战任务' },
];
