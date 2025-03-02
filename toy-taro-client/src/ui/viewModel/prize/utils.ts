import { PRIZE_TYPE, PrizeModel } from '@core';

export const getPrizeDetailDesc = (prize: PrizeModel, coupon?: { detailTip: string }) => {
  const { type, points, drawCount } = prize;
  if (type === PRIZE_TYPE.POINTS && points) {
    return `+${points}积分`;
  }
  if (type === PRIZE_TYPE.COUPON && coupon) {
    return coupon.detailTip;
  }
  if (type === PRIZE_TYPE.LUCKY_DRAW && drawCount) {
    return `+${drawCount}张祈愿券`;
  }
  return '';
};

export const getPrizeShortDesc = (prize: PrizeModel, coupon?: { shortTip: string }) => {
  const { type, points, drawCount } = prize;
  if (type === PRIZE_TYPE.POINTS && points) {
    return `+${points}积分`;
  }
  if (type === PRIZE_TYPE.COUPON && coupon) {
    return coupon.shortTip;
  }
  if (type === PRIZE_TYPE.LUCKY_DRAW && drawCount) {
    return `+${drawCount}张祈愿券`;
  }
  return '';
};
