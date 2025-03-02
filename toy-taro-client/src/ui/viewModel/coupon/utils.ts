import { CouponModel } from '@core';

export const getNormalCouponInfo = (coupon: CouponModel) => {
  // get 属性需要手动取，无法 ...coupon 获取到
  // Picker 组件的 rangeKey 内部估计是解构的，也无法取到
  return {
    discountTip: coupon.discountTip,
    usageScopeTip: coupon.usageScopeTip,
    conditionTip: coupon.conditionTip,
    expirationTip: coupon.expirationTip,
    detailTip: coupon.detailTip,
    shortTip: coupon.shortTip,
    terseTip: coupon.terseTip,
  };
};
