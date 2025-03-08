import { computed, makeObserver, observable } from '@shared/utils/observer';
import { ROLE } from '../constants';
import { UserEntity } from '../entity';
import { getSourceUrl } from '../utils/helper';

export class UserModel {
  id: string;

  @observable
  name?: string;

  @observable
  avatarUrl?: string;

  role: ROLE;

  @observable
  score?: number;

  @observable
  drawTicket?: number;

  constructor(entity: UserEntity) {
    makeObserver(this);
    const { id, name, avatarUrl, role, score, draw_ticket } = entity;
    this.id = id;
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.role = role;
    this.score = score;
    this.drawTicket = draw_ticket;
  }

  @computed
  get nickName() {
    return this.name ?? '未设置';
  }

  @computed
  get avatar() {
    const url =
      this.avatarUrl ??
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-avatar.png';
    return getSourceUrl(url);
  }

  @computed
  get availableScore() {
    return this.score ?? 0;
  }

  @computed
  get availableDrawTicket() {
    return this.drawTicket ?? 0;
  }

  @computed
  get isAdmin() {
    return this.role === ROLE.ADMIN;
  }

  toEntity(): UserEntity {
    return {
      id: this.id,
      name: this.name,
      avatarUrl: this.avatarUrl,
      role: this.role,
      score: this.score,
      draw_ticket: this.drawTicket,
    };
  }
}
