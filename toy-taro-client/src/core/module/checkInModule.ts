import cloneDeep from 'lodash/cloneDeep';
import { CheckInApi } from '../api';
import { AbstractModule } from '../base';
import { MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class CheckInModule extends AbstractModule {
  protected onLoad() {}
  protected onUnload() {}
  protected moduleName(): string {
    return MODULE_NAME.CHECK_IN;
  }

  async syncCheckInInfo() {
    storeManager.startLoading(STORE_NAME.CHECK_IN);
    const checkInInfo = await CheckInApi.getCheckInList();
    storeManager.refresh(STORE_NAME.CHECK_IN, checkInInfo);
    storeManager.stopLoading(STORE_NAME.CHECK_IN);
  }

  async claimReward(ruleId: string) {
    try {
      await CheckInApi.claimReward(ruleId);
      const checkInInfo = storeManager.get(STORE_NAME.CHECK_IN);
      if (!checkInInfo) {
        throw new Error('CheckIn info is not loaded');
      }
      const rules = cloneDeep(checkInInfo.rules);
      const rule = rules.find(item => item.id === ruleId);
      if (!rule) {
        throw new Error('Rule not found');
      }
      rule.reward.is_claimed = true;
      storeManager.emitUpdate(STORE_NAME.CHECK_IN, {
        partials: [
          {
            id: checkInInfo.id,
            rules: [...rules],
          },
        ],
      });
    } catch (error) {
      this._logger.info('Claim reward failed', error);
      throw error;
    }
  }

  async checkInToday() {
    try {
      await CheckInApi.checkInToday();
      const checkInInfo = storeManager.get(STORE_NAME.CHECK_IN);
      if (!checkInInfo) {
        throw new Error('CheckIn info is not loaded');
      }
      const days = [...checkInInfo.days];
      days.push(new Date().getDate());
      storeManager.emitUpdate(STORE_NAME.CHECK_IN, {
        partials: [
          {
            id: checkInInfo.id,
            days,
          },
        ],
      });
    } catch (error) {
      this._logger.info('Check in today failed', error);
      throw error;
    }
  }
}
