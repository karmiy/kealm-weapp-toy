import { computed, makeObserver, observable } from '@shared/utils/observer';
import { ROLE } from '../constants';
import { UserEntity } from '../entity';

export class UserModel {
  id: string;

  @observable
  name?: string;

  @observable
  avatarUrl?: string;

  role: ROLE;

  @observable
  score?: number;

  constructor(entity: UserEntity) {
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
    return this.name ?? '未设置';
  }

  @computed
  get avatar() {
    return (
      this.avatarUrl ||
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-avatar.png'
    );
  }

  @computed
  get availableScore() {
    return this.score ?? 0;
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
    };
  }
}
