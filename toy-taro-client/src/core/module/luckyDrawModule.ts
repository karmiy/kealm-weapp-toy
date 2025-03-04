// import { LuckyDrawApi } from '../api';
import { LuckyDrawApi } from '../api';
import { AbstractModule } from '../base';
import { LUCK_DRAW_PREVIEW_ID, MODULE_NAME, STORE_NAME } from '../constants';
import { LuckyDrawEntity } from '../entity';
import { storeManager } from '../storeManager';
import { LuckyDrawUpdateParams } from '../types';

export class LuckyDrawModule extends AbstractModule {
  protected onLoad() {
    this.syncLuckyDrawList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.LUCKY_DRAW;
  }

  async createMockLuckyDraw(luckyDraw: LuckyDrawUpdateParams) {
    try {
      const { type, coverImage, name, quantity, list } = luckyDraw;
      const mockLuckyDraw = storeManager.getById(STORE_NAME.LUCKY_DRAW, LUCK_DRAW_PREVIEW_ID);
      if (mockLuckyDraw) {
        await this.clearMockLuckyDraw();
      }
      this._logger.info('createMockLuckyDraw', luckyDraw);
      const now = new Date().getTime();
      const entity: LuckyDrawEntity = {
        id: LUCK_DRAW_PREVIEW_ID,
        cover_image: coverImage,
        type,
        name,
        quantity,
        list,
        create_time: now,
        last_modified_time: now,
      };
      storeManager.emitUpdate(STORE_NAME.LUCKY_DRAW, {
        entities: [entity],
      });
    } catch (error) {
      this._logger.info('createMockLuckyDraw error', error.message);
      throw error;
    }
  }
  async clearMockLuckyDraw() {
    try {
      this._logger.info('clearMockLuckyDraw');
      storeManager.emitDelete(STORE_NAME.LUCKY_DRAW, [LUCK_DRAW_PREVIEW_ID]);
    } catch (error) {
      this._logger.info('clearMockLuckyDraw error', error.message);
      throw error;
    }
  }

  async syncLuckyDrawList() {
    storeManager.startLoading(STORE_NAME.LUCKY_DRAW);
    const luckyDrawList = await LuckyDrawApi.getLuckyDrawList();
    storeManager.refresh(STORE_NAME.LUCKY_DRAW, luckyDrawList);
    storeManager.stopLoading(STORE_NAME.LUCKY_DRAW);
  }

  async deleteLuckyDraw(id: string) {
    try {
      this._logger.info('deleteLuckyDraw', id);
      await LuckyDrawApi.deleteLuckyDraw(id);
      storeManager.emitDelete(STORE_NAME.LUCKY_DRAW, [id]);
    } catch (error) {
      this._logger.info('deleteLuckyDraw error', error.message);
      throw error;
    }
  }

  async updateLuckyDraw(luckyDraw: LuckyDrawUpdateParams) {
    try {
      const { id, type, coverImage, name, quantity, list } = luckyDraw;
      this._logger.info('updateLuckyDraw', luckyDraw);
      const entity = await LuckyDrawApi.updateLuckyDraw({
        id,
        type,
        cover_image: coverImage,
        name,
        quantity,
        list,
      });
      this._logger.info('updateLuckyDraw success', entity);
      storeManager.emitUpdate(STORE_NAME.LUCKY_DRAW, {
        entities: [entity],
      });
    } catch (error) {
      this._logger.info('updateLuckyDraw error', error.message);
      throw error;
    }
  }
}
