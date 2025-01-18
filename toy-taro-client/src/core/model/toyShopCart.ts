import { ToyShopCartEntity } from '../entity';

export class ToyShopCartModel {
  id: string;
  productId: string;
  userId: string;
  createTime: number;
  lastModifiedTime: number;
  quantity: number;

  constructor(entity: ToyShopCartEntity) {
    const { id, product_id, user_id, create_time, last_modified_time, quantity } = entity;
    this.id = id;
    this.productId = product_id;
    this.userId = user_id;
    this.createTime = create_time;
    this.lastModifiedTime = last_modified_time;
    this.quantity = quantity;
  }
}
