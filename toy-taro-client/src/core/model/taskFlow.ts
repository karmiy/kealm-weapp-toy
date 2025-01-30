import { format } from 'date-fns';
import { computed, makeObserver, observable } from '@shared/utils/observer';
import { TASK_STATUS } from '../constants';
import { TaskFlowEntity } from '../entity';

export class TaskFlowModel {
  id: string;

  taskId: string;

  @observable
  status: TASK_STATUS;

  userId: string;

  createTime: number;

  @observable
  lastModifiedTime: number;

  constructor(entity: TaskFlowEntity) {
    makeObserver(this);
    const { id, task_id, status, user_id, create_time, last_modified_time } = entity;
    this.id = id;
    this.taskId = task_id;
    this.status = status;
    this.userId = user_id;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
  }

  @computed
  get isFinished() {
    return this.status === TASK_STATUS.APPROVED;
  }

  @computed
  get isPendingApproval() {
    return this.status === TASK_STATUS.PENDING_APPROVAL;
  }

  @computed
  get isRejected() {
    return this.status === TASK_STATUS.REJECTED;
  }

  @computed
  get lastModifiedDate() {
    return format(this.lastModifiedTime, 'yyyy-MM-dd');
  }

  @computed
  get operateDateTitle() {
    const date = this.lastModifiedDate;
    return this.isPendingApproval ? `审批发起时间：${date}` : `审批完成时间：${date}`;
  }
}
