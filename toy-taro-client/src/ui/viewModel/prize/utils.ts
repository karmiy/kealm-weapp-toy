import { PRIZE_TYPE, PrizeModel } from '@core';

export const getPrizeDesc = (params: {
  prize: PrizeModel;
  coupon?: { detailTip: string; shortTip: string; terseTip: string };
  descLevel: 'detail' | 'short' | 'terse';
}) => {
  const { prize, coupon, descLevel } = params;
  const { type, points, drawCount, text } = prize;
  if (type === PRIZE_TYPE.POINTS && points) {
    return `+${points}积分`;
  }
  if (type === PRIZE_TYPE.COUPON && coupon) {
    switch (descLevel) {
      case 'detail':
        return coupon.detailTip;
      case 'short':
        return coupon.shortTip;
      case 'terse':
        return coupon.terseTip;
      default:
        return coupon.detailTip;
    }
  }
  if (type === PRIZE_TYPE.LUCKY_DRAW && drawCount) {
    return `+${drawCount}张祈愿券`;
  }
  if (type === PRIZE_TYPE.NONE && text) {
    return text;
  }
  return '';
};
