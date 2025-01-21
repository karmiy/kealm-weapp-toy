import { ProductModel, STORE_NAME } from '@core';
import { AbstractCategoryController } from './base';

export class ProductCategoryController extends AbstractCategoryController<ProductModel> {
  static identifier = 'ProductCategoryController';

  constructor() {
    super(STORE_NAME.PRODUCT);
  }
}
