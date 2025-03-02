import { getApp } from '@tarojs/taro';
import { ProductGroupController } from './productGroupController';
import { ProductLimitedTimeOfferController } from './productLimitedTimeOfferController';
import { ProductShopCartController } from './productShopCartController';
import { TaskFlowGroupController } from './taskFlowGroupController';
import { TaskGroupController } from './taskGroupController';
import { UserCouponController } from './userCouponController';

const controllers: Array<{
  getInstance: () => {
    init: () => void;
    dispose: () => void;
  };
  name: string;
}> = [
  ProductLimitedTimeOfferController,
  ProductGroupController,
  ProductShopCartController,
  UserCouponController,
  TaskGroupController,
  TaskFlowGroupController,
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
  ProductGroupController,
  ProductShopCartController,
  UserCouponController,
  TaskGroupController,
  TaskFlowGroupController,
};
