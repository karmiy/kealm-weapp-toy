import { ToyLimitedTimeOfferController } from './toyLimitedTimeOfferController';

const controllers = [ToyLimitedTimeOfferController];

function bootstrap() {
  controllers.forEach(controller => {
    controller.getInstance().init();
  });
}

export { bootstrap, ToyLimitedTimeOfferController };
