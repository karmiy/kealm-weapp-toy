import { getApp } from '@tarojs/taro';
import { CouponController } from './couponController';
import { ProductCategoryController } from './productCategoryController';
import { ProductLimitedTimeOfferController } from './productLimitedTimeOfferController';
import { ProductShopCartController } from './productShopCartController';
import { TaskCategoryController } from './taskCategoryController';

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
  TaskCategoryController,
];

function bootstrap() {
  controllers.forEach(controller => {
    controller.getInstance().init();
    getApp()[controller.name] = controller;
  });
}

function unBootstrap() {
  controllers.forEach(controller => {
    controller.getInstance().dispose();
  });
}

export {
  bootstrap,
  unBootstrap,
  ProductLimitedTimeOfferController,
  ProductCategoryController,
  ProductShopCartController,
  CouponController,
  TaskCategoryController,
};
