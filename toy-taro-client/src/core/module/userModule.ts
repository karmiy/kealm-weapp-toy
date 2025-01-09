import { AbstractModule } from '../base';
import { MODULE_NAME } from '../constants';

export class UserModule extends AbstractModule {
  protected async onLoad() {}
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.USER;
  }

  login() {}
}
