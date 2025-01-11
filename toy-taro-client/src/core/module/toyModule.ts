import { ToyApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class ToyModule extends AbstractModule {
  protected onLoad() {
    this.getToyList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.TOY;
  }

  async getToyList() {
    const toyList = await ToyApi.getToyList();
    storeManager.refresh(STORE_NAME.TOY, toyList);
    return toyList;
  }

  update(id: string, name: string) {
    storeManager.emitUpdate(STORE_NAME.TOY, {
      partials: [
        {
          id,
          name,
        },
      ],
    });
  }
}
