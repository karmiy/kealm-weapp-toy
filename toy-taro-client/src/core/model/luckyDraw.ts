import { computed, makeObserver, observable } from '@shared/utils/observer';
import { LUCKY_DRAW_TYPE } from '../constants';
import { LuckDrawPrize, LuckyDrawEntity } from '../entity';
import { getSourceUrl } from '../utils/helper';

export class LuckyDrawModel {
  id: string;

  type: LUCKY_DRAW_TYPE;

  @observable
  coverImage: string;

  name: string;

  quantity: number;

  list: Array<LuckDrawPrize>;

  @observable
  createTime: number;

  @observable
  lastModifiedTime: number;

  constructor(entity: LuckyDrawEntity) {
    makeObserver(this);
    const { id, type, name, quantity, list, cover_image, create_time, last_modified_time } = entity;
    this.id = id;
    this.type = type;
    this.name = name;
    this.quantity = quantity;
    this.list = list;
    this.coverImage = cover_image;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
  }

  @computed
  get coverImageUrl() {
    return getSourceUrl(this.coverImage);
  }
}
