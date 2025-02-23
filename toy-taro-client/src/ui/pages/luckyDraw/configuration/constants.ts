export enum PRIZE_TYPE {
  POINTS = 'POINTS',
  COUPON = 'COUPON',
  NONE = 'NONE',
}

export const PRIZE_COVER_IMG = {
  [PRIZE_TYPE.POINTS]: 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-red-envelop.png',
  [PRIZE_TYPE.COUPON]: 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-coupon.png',
  [PRIZE_TYPE.NONE]: 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-sad.png',
};

export enum LUCKY_DRAW_TYPE {
  WHEEL = 'WHEEL',
  GRID = 'GRID',
}

export const LUCKY_DRAW_TYPE_LIST = [
  {
    value: LUCKY_DRAW_TYPE.WHEEL,
    label: '转盘',
  },
  {
    value: LUCKY_DRAW_TYPE.GRID,
    label: '宫格',
  },
];

export const MAX_PRIZE_COUNT = {
  DEFAULT: 10,
  [LUCKY_DRAW_TYPE.WHEEL]: 10,
  [LUCKY_DRAW_TYPE.GRID]: 24,
};
