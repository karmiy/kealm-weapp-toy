import { makeObserver, observable } from '@shared/utils/observer';
import { LUCKY_DRAW_TYPE } from '../constants';
import { LuckDrawPrize, LuckyDrawEntity } from '../entity';

export class LuckyDrawModel {
  id: string;

  type: LUCKY_DRAW_TYPE;

  name: string;

  quantity: number;

  list: Array<LuckDrawPrize>;

  @observable
  createTime: number;

  @observable
  lastModifiedTime: number;

  constructor(entity: LuckyDrawEntity) {
    makeObserver(this);
    const { id, type, name, quantity, list, create_time, last_modified_time } = entity;
    this.id = id;
    this.type = type;
    this.name = name;
    this.quantity = quantity;
    this.list = list;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
  }
}
