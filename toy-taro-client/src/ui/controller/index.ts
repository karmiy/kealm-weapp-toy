import { getApp } from '@tarojs/taro';
import { CouponController } from './couponController';
import { ProductCategoryController } from './productCategoryController';
import { ProductLimitedTimeOfferController } from './productLimitedTimeOfferController';
import { ProductShopCartController } from './productShopCartController';

const controllers: Array<{
  getInstance: () => {
    init: () => void;
    dispose: () => void;
  };
  name: string;
}> = [
  ProductLimitedTimeOfferController,
  ProductCategoryController,
  ProductShopCartController,
  CouponController,
];

function bootstrap() {
  controllers.forEach(controller => {
    controller.getInstance().init();
    getApp()[controller.name] = controller;
  });
}

export {
  bootstrap,
  ProductLimitedTimeOfferController,
  ProductCategoryController,
  ProductShopCartController,
  CouponController,
};
