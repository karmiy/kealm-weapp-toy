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

  approverId?: string;

  constructor(entity: TaskFlowEntity) {
    makeObserver(this);
    const { id, task_id, status, user_id, create_time, last_modified_time, approver_id } = entity;
    this.id = id;
    this.taskId = task_id;
    this.status = status;
    this.userId = user_id;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
    this.approverId = approver_id;
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
    return format(this.lastModifiedTime, 'yyyy-MM-dd HH:mm:ss');
  }

  @computed
  get createDate() {
    return format(this.createTime, 'yyyy-MM-dd HH:mm:ss');
  }
}
