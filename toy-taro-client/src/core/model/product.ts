import { computed, makeObserver, observable } from '@shared/utils/observer';
import { ProductEntity } from '../entity';

export class ProductModel {
  id: string;

  name: string;
  desc?: string;
  @observable
  discountedScore?: number;
  @observable
  originalScore: number;
  stock: number;
  coverImage: string;
  @observable
  createTime: number;
  @observable
  flashSaleStart?: number;
  @observable
  flashSaleEnd?: number;
  categoryId: string;

  constructor(entity: ProductEntity) {
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
      category_id,
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
    this.categoryId = category_id;
  }

  @computed
  get isLimitedTimeOffer() {
    const now = new Date().getTime();
    return Boolean(
      this.discountedScore &&
        this.flashSaleStart &&
        this.flashSaleEnd &&
        this.flashSaleStart <= now &&
        this.flashSaleEnd >= now,
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
