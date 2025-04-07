import { DisciplineApi } from '../api';
import { AbstractModule } from '../base/abstractModule';
import { DISCIPLINE_TYPE, MODULE_NAME } from '../constants';

export class DisciplineModule extends AbstractModule {
  protected moduleName(): string {
    return MODULE_NAME.DISCIPLINE;
  }

  protected onLoad() {}

  protected onUnload() {}

  /**
   * 惩罚用户
   * @param params 惩罚参数
   * @returns 惩罚记录ID
   */
  async createDiscipline(params: {
    userId: string;
    prizeId: string;
    type: DISCIPLINE_TYPE;
    reason: string;
  }) {
    try {
      this._logger.info('createDiscipline', params);
      const { userId, prizeId, type, reason } = params;

      const result = await DisciplineApi.createDiscipline({
        userId,
        type,
        reason,
        prizeId,
      });

      this._logger.info('createDiscipline success', result);
      return result;
    } catch (error) {
      this._logger.info('createDiscipline error', error.message);
      throw error;
    }
  }
}
