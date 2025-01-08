import { UserEntity } from '../entity';

export class UserModel {
  id: string;
  name: string;
  constructor(entity: UserEntity) {
    const { id, name } = entity;
    this.id = id;
    this.name = name;
  }
}
