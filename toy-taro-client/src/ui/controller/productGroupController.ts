import { ProductModel, STORE_NAME } from '@core';
import { AbstractGroupByController } from './base';

export class ProductGroupController extends AbstractGroupByController<ProductModel> {
  static identifier = 'ProductGroupController';

  constructor() {
    super(STORE_NAME.PRODUCT);
  }

  protected getGroupByIdentifier(model: ProductModel) {
    return model.categoryId;
  }
}
