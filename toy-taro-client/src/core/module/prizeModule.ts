import { PrizeApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';
import { PrizeUpdateParams } from '../types';

export class PrizeModule extends AbstractModule {
  protected onLoad() {
    this.syncPrizeList();
  }
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.PRIZE;
  }

  async syncPrizeList() {
    storeManager.startLoading(STORE_NAME.PRIZE);
    const prizeList = await PrizeApi.getPrizeList();
    storeManager.refresh(STORE_NAME.PRIZE, prizeList);
    storeManager.stopLoading(STORE_NAME.PRIZE);
  }

  async deletePrize(id: string) {
    try {
      this._logger.info('deletePrize', id);
      await PrizeApi.deletePrize(id);
      storeManager.emitDelete(STORE_NAME.PRIZE, [id]);
    } catch (error) {
      this._logger.info('deletePrize error', error.message);
      throw error;
    }
  }

  async updatePrize(prize: PrizeUpdateParams) {
    try {
      const { id, couponId, points, type } = prize;
      this._logger.info('updatePrize', prize);
      const entity = await PrizeApi.updatePrize({
        id,
        type,
        coupon_id: couponId,
        points,
      });
      this._logger.info('updatePrize success', entity);
      storeManager.emitUpdate(STORE_NAME.PRIZE, {
        entities: [entity],
      });
    } catch (error) {
      this._logger.info('updatePrize error', error.message);
      throw error;
    }
  }

  async sortPrize(ids: string[]) {
    try {
      this._logger.info('sortPrize', ids);
      const sortItems = await PrizeApi.sortPrize(ids);
      this._logger.info('sortPrize success', sortItems);
      storeManager.emitUpdate(STORE_NAME.PRIZE, {
        partials: sortItems,
      });
    } catch (error) {
      this._logger.info('sortPrize error', error.message);
      throw error;
    }
  }
}
