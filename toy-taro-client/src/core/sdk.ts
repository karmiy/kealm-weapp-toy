import { Logger } from '@shared/utils/logger';
import { AbstractModule } from './base';
import { MODULE_WEIGHT } from './constants';
import {
  CheckInModule,
  CouponModule,
  OrderModule,
  ProductModule,
  TaskModule,
  UserModule,
} from './module';
import { storeManager } from './storeManager';

type Modules = {
  product: ProductModule;
  user: UserModule;
  coupon: CouponModule;
  task: TaskModule;
  order: OrderModule;
  checkIn: CheckInModule;
};

const modulesConfig: Array<{
  weight: MODULE_WEIGHT;
  module: new () => AbstractModule;
  alias: keyof Modules;
}> = [
  {
    weight: MODULE_WEIGHT.HIGH,
    module: UserModule,
    alias: 'user',
  },
  {
    weight: MODULE_WEIGHT.NORMAL,
    module: ProductModule,
    alias: 'product',
  },
  {
    weight: MODULE_WEIGHT.NORMAL,
    module: CouponModule,
    alias: 'coupon',
  },
  {
    weight: MODULE_WEIGHT.NORMAL,
    module: TaskModule,
    alias: 'task',
  },
  {
    weight: MODULE_WEIGHT.NORMAL,
    module: OrderModule,
    alias: 'order',
  },
  {
    weight: MODULE_WEIGHT.NORMAL,
    module: CheckInModule,
    alias: 'checkIn',
  },
];

class SDK {
  private _isLoaded = false;
  private get _logger() {
    return Logger.getLogger('[SDK]');
  }

  modules = {} as Modules;
  storeManager = storeManager;

  async load() {
    storeManager.init();
    const loadedModules: Array<string> = [];
    try {
      this._logger.error('start load');
      if (this._isLoaded) {
        this._logger.info('skip load, has already loaded');
        return;
      }
      const highLevelModules: Array<string> = [];
      const normalLevelModules: Array<string> = [];
      const lowLevelModules: Array<string> = [];
      // const sortModulesConfig = [...modulesConfig].sort((a, b) => a.weight - b.weight);
      modulesConfig.forEach(config => {
        const { module: ModuleConstructor, alias, weight } = config;
        this.modules[alias] = new (ModuleConstructor as any)();

        switch (weight) {
          case MODULE_WEIGHT.HIGH:
            highLevelModules.push(alias);
            break;
          case MODULE_WEIGHT.NORMAL:
            normalLevelModules.push(alias);
            break;
          case MODULE_WEIGHT.LOW:
            lowLevelModules.push(alias);
            break;
        }
      });
      const loadModule = async (alias: string) => {
        loadedModules.push(alias);
        await this.modules[alias].load();
      };
      await Promise.all(highLevelModules.map(async alias => await loadModule(alias)));
      await Promise.all(normalLevelModules.map(async alias => await loadModule(alias)));
      await Promise.all(lowLevelModules.map(async alias => await loadModule(alias)));
      this._isLoaded = true;
    } catch (error) {
      this._logger.error('load failed', error);
      await Promise.all(loadedModules.map(async alias => await this.modules[alias].unload()));
      storeManager.dispose();
      throw error;
    }
  }

  async unload() {
    if (!this._isLoaded) {
      this._logger.info('skip unload, has not loaded');
      return;
    }
    await Promise.all(Object.values(this.modules).map(async module => await module.unload()));
    storeManager.dispose();
    this._isLoaded = false;
  }
}

const sdk = new SDK();

export { sdk };
