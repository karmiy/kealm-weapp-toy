import { TASK_STATUS } from '@core';
import { TASK_ACTION_ID } from '@ui/viewModel';

interface ActionItem {
  id?: TASK_ACTION_ID;
  type: 'primary' | 'plain';
  label: string;
  disabled: boolean;
}

export const ACTION_TITLE: Record<string, Record<TASK_STATUS, ActionItem[]>> = {
  admin: {
    [TASK_STATUS.PENDING_APPROVAL]: [
      {
        id: TASK_ACTION_ID.REJECT,
        type: 'plain',
        label: '拒绝',
        disabled: false,
      },
      {
        id: TASK_ACTION_ID.APPROVE,
        type: 'primary',
        label: '同意',
        disabled: false,
      },
    ],
    [TASK_STATUS.APPROVED]: [
      {
        type: 'plain',
        label: '已同意',
        disabled: true,
      },
    ],
    [TASK_STATUS.REJECTED]: [
      {
        type: 'plain',
        label: '已拒绝',
        disabled: true,
      },
    ],
  },
  user: {
    [TASK_STATUS.PENDING_APPROVAL]: [
      {
        type: 'plain',
        label: '审批中',
        disabled: true,
      },
    ],
    [TASK_STATUS.APPROVED]: [
      {
        type: 'plain',
        label: '已完成',
        disabled: true,
      },
    ],
    [TASK_STATUS.REJECTED]: [
      {
        type: 'plain',
        label: '已拒绝',
        disabled: true,
      },
    ],
  },
};
