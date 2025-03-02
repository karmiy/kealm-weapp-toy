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
