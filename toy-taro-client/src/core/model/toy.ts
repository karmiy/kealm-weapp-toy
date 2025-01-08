import { ToyEntity } from '../entity';

export class ToyModel {
  id: string;
  name: string;
  desc: string;
  constructor(entity: ToyEntity) {
    const { id, name, desc } = entity;
    this.id = id;
    this.name = name;
    this.desc = desc;
  }
}
