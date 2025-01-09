import { Logger } from '@/utils/logger';

export abstract class AbstractModule {
  protected get _logger() {
    return Logger.getLogger(`[${this.moduleName()}]`);
  }

  load() {
    this._logger.info('load');
    this.onLoad();
  }

  unload() {
    this._logger.info('unload');
    this.onUnload();
  }

  protected abstract onLoad(): void;
  protected abstract onUnload(): void;
  protected abstract moduleName(): string;
}
