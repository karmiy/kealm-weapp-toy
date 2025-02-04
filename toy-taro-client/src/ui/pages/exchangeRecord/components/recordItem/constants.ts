import { ORDER_STATUS } from '@core';
import { ORDER_ACTION_ID } from '@ui/viewModel';

interface ActionItem {
  id?: ORDER_ACTION_ID;
  type: 'primary' | 'plain';
  label: string;
  disabled: boolean;
  hide?: boolean;
}

export const ORDER_TIME_TITLE: Record<string, Record<ORDER_STATUS, string>> = {
  admin: {
    [ORDER_STATUS.INITIAL]: '',
    [ORDER_STATUS.REVOKING]: '撤销时间',
    [ORDER_STATUS.APPROVED]: '审批时间',
    [ORDER_STATUS.REJECTED]: '审批时间',
  },
  user: {
    [ORDER_STATUS.INITIAL]: '',
    [ORDER_STATUS.REVOKING]: '撤销时间',
    [ORDER_STATUS.APPROVED]: '审批时间',
    [ORDER_STATUS.REJECTED]: '审批时间',
  },
};

export const ACTION_TITLE: Record<string, Record<ORDER_STATUS, ActionItem[]>> = {
  admin: {
    [ORDER_STATUS.INITIAL]: [
      {
        type: 'plain',
        label: '兑换记录',
        disabled: true,
        hide: true,
      },
    ],
    [ORDER_STATUS.REVOKING]: [
      {
        id: ORDER_ACTION_ID.REJECT,
        type: 'plain',
        label: '拒绝撤销',
        disabled: false,
      },
      {
        id: ORDER_ACTION_ID.APPROVE,
        type: 'primary',
        label: '同意撤销',
        disabled: false,
      },
    ],
    [ORDER_STATUS.APPROVED]: [
      {
        type: 'plain',
        label: '已同意撤销',
        disabled: true,
      },
    ],
    [ORDER_STATUS.REJECTED]: [
      {
        type: 'plain',
        label: '已拒绝撤销',
        disabled: true,
      },
    ],
  },
  user: {
    [ORDER_STATUS.INITIAL]: [
      {
        id: ORDER_ACTION_ID.REVOKE,
        type: 'plain',
        label: '撤销',
        disabled: false,
      },
    ],
    [ORDER_STATUS.REVOKING]: [
      {
        type: 'plain',
        label: '撤销中',
        disabled: true,
      },
    ],
    [ORDER_STATUS.APPROVED]: [
      {
        type: 'plain',
        label: '已撤销',
        disabled: true,
      },
    ],
    [ORDER_STATUS.REJECTED]: [
      {
        id: ORDER_ACTION_ID.REVOKE,
        type: 'plain',
        label: '撤销',
        disabled: false,
      },
    ],
  },
};
