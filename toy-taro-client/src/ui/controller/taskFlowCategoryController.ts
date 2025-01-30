import { STORE_NAME, TaskFlowModel } from '@core';
import { AbstractCategoryController } from './base';

export class TaskFlowCategoryController extends AbstractCategoryController<TaskFlowModel> {
  static identifier = 'TaskFlowCategoryController';

  constructor() {
    super(STORE_NAME.TASK_FLOW);
  }

  protected getCategoryIdentifier(model: TaskFlowModel) {
    return model.taskId;
  }
}
