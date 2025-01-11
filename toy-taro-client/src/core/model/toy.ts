import { computed, makeObserver, observable } from '@/utils/observer';
import { ToyEntity } from '../entity';

export class ToyModel {
  @observable
  id: string;

  @observable
  name: string;
  @observable
  desc?: string;
  @observable
  discountedScore?: number;
  @observable
  originalScore: number;
  @observable
  stock: number;
  @observable
  coverImage: string;
  @observable
  createTime: number;
  @observable
  flashSaleStart?: number;
  @observable
  flashSaleEnd?: number;

  constructor(entity: ToyEntity) {
    makeObserver(this);
    const {
      id,
      name,
      desc,
      discounted_score,
      original_score,
      stock,
      cover_image,
      create_time,
      flash_sale_start,
      flash_sale_end,
    } = entity;
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.discountedScore = discounted_score;
    this.originalScore = original_score;
    this.stock = stock;
    this.coverImage = cover_image;
    this.createTime = create_time;
    this.flashSaleStart = flash_sale_start;
    this.flashSaleEnd = flash_sale_end;
  }

  @computed
  get isTimeLimited() {
    return (
      this.flashSaleStart &&
      this.flashSaleEnd &&
      this.flashSaleStart < Date.now() &&
      this.flashSaleEnd > Date.now()
    );
  }

  @computed
  get score() {
    return this.discountedScore ?? this.originalScore;
  }

  @computed
  get createDate() {
    return new Date(this.createTime);
  }
}
