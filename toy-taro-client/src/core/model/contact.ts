import { computed, makeObserver, observable } from '@shared/utils/observer';
import { ROLE } from '../constants';
import { ContactEntity } from '../entity';
import { getSourceUrl } from '../utils/helper';

export class ContactModel {
  id: string;

  @observable
  name?: string;

  @observable
  avatarUrl?: string;

  role: ROLE;

  @observable
  score?: number;

  constructor(entity: ContactEntity) {
    makeObserver(this);
    const { id, name, avatarUrl, role, score } = entity;
    this.id = id;
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.role = role;
    this.score = score;
  }

  @computed
  get nickName() {
    return this.name ?? `游客-${this.id}`;
  }

  @computed
  get avatar() {
    const url =
      this.avatarUrl ??
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-avatar.png';
    return getSourceUrl(url);
  }

  @computed
  get isAdmin() {
    return this.role === ROLE.ADMIN;
  }

  toEntity(): ContactEntity {
    return {
      id: this.id,
      name: this.name,
      avatarUrl: this.avatarUrl,
      role: this.role,
      score: this.score,
    };
  }
}
