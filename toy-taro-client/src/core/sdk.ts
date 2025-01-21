import { Logger } from '@shared/utils/logger';
import { AbstractModule } from './base';
import { MODULE_WEIGHT } from './constants';
import { CouponModule, ProductModule, TaskModule, UserModule } from './module';
import { storeManager } from './storeManager';

type Modules = {
  product: ProductModule;
  user: UserModule;
  coupon: CouponModule;
  task: TaskModule;
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
];

class SDK {
  private _isLoaded = false;
  private get _logger() {
    return Logger.getLogger('[SDK]');
  }

  modules = {} as Modules;
  storeManager = storeManager;

  async load() {
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
    await Promise.all(highLevelModules.map(alias => this.modules[alias].load()));
    await Promise.all(normalLevelModules.map(alias => this.modules[alias].load()));
    await Promise.all(lowLevelModules.map(alias => this.modules[alias].load()));
    this._isLoaded = true;
  }

  unload() {
    if (!this._isLoaded) {
      this._logger.info('skip unload, has not loaded');
      return;
    }
    Object.values(this.modules).forEach(module => module.unload());
  }
}

const sdk = new SDK();

export { sdk };
