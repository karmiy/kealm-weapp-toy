import { computed, makeObserver, observable } from '@shared/utils/observer';
import { ProductEntity } from '../entity';
import { getSourceUrl } from '../utils/helper';

export class ProductModel {
  id: string;

  name: string;
  desc?: string;
  @observable
  discountedScore?: number;
  @observable
  originalScore: number;
  stock: number;
  @observable
  coverImage: string;
  @observable
  createTime: number;
  lastModifiedTime: number;
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
      last_modified_time,
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
    this.lastModifiedTime = last_modified_time;
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
    return this.isLimitedTimeOffer
      ? this.discountedScore ?? this.originalScore
      : this.originalScore;
  }

  @computed
  get createDate() {
    return new Date(this.createTime);
  }

  @computed
  get coverImageUrl() {
    return getSourceUrl(this.coverImage);
  }
}
