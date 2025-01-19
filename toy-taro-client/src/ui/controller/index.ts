import { getApp } from '@tarojs/taro';
import { ToyCategoryController } from './toyCategoryController';
import { ToyLimitedTimeOfferController } from './toyLimitedTimeOfferController';
import { ToyShopCartController } from './toyShopCartController';

const controllers: Array<{
  getInstance: () => {
    init: () => void;
    dispose: () => void;
  };
  name: string;
}> = [ToyLimitedTimeOfferController, ToyCategoryController, ToyShopCartController];

function bootstrap() {
  controllers.forEach(controller => {
    controller.getInstance().init();
    getApp()[controller.name] = controller;
  });
}

export { bootstrap, ToyLimitedTimeOfferController, ToyCategoryController };
