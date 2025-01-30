import { STORE_NAME, TASK_TYPE, TaskModel } from '@core';
import { AbstractGroupByController } from './base';

export class TaskGroupController extends AbstractGroupByController<TaskModel> {
  static identifier = 'TaskGroupController';

  constructor() {
    super(STORE_NAME.TASK);
  }

  generateGroupByIdentifier(type: TASK_TYPE, categoryId: string) {
    return type + '_' + categoryId;
  }

  protected getGroupByIdentifier(model: TaskModel) {
    return this.generateGroupByIdentifier(model.type, model.categoryId);
  }

  protected isMatchFunc(model: TaskModel) {
    return true;
  }
}
