import { Logger } from '@shared/utils/logger';
import { ISDK } from '../types';

export abstract class AbstractModule {
  constructor(protected _sdk: ISDK) {}

  protected get _logger() {
    return Logger.getLogger(`[${this.moduleName()}]`);
  }

  async load() {
    this._logger.info('load');
    await this.onLoad();
  }

  async unload() {
    this._logger.info('unload');
    await this.onUnload();
  }

  protected abstract onLoad(): void;
  protected abstract onUnload(): void;
  protected abstract moduleName(): string;
}
