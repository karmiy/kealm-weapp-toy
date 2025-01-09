import { ToyApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME } from '../constants';

export class ToyModule extends AbstractModule {
  protected onLoad() {}
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.TOY;
  }

  async getToyList() {
    return await ToyApi.getToyList();
  }
}
