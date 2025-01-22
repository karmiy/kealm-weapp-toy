import { STORE_NAME, TASK_STATUS, TASK_TYPE, TaskModel } from '@core';
import { AbstractCategoryController } from './base';

export class TaskCategoryController extends AbstractCategoryController<TaskModel> {
  static identifier = 'TaskCategoryController';

  constructor() {
    super(STORE_NAME.TASK);
  }

  generateCategoryIdentifier(type: TASK_TYPE, categoryId: string) {
    return type + '_' + categoryId;
  }

  protected getCategoryIdentifier(model: TaskModel) {
    return this.generateCategoryIdentifier(model.type, model.categoryId);
  }

  protected isMatchFunc(model: TaskModel) {
    return model.status !== TASK_STATUS.APPROVED;
  }
}
