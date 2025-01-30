import { STORE_NAME, TaskFlowModel } from '@core';
import { AbstractGroupByController } from './base';

export class TaskFlowGroupController extends AbstractGroupByController<TaskFlowModel> {
  static identifier = 'TaskFlowGroupController';

  constructor() {
    super(STORE_NAME.TASK_FLOW);
  }

  protected getGroupByIdentifier(model: TaskFlowModel) {
    return model.taskId;
  }
}
