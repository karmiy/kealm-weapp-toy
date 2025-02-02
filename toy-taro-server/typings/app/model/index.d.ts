// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGroup from '../../../app/model/group';
import ExportProduct from '../../../app/model/product';
import ExportProductCategory from '../../../app/model/productCategory';
import ExportProductShopCart from '../../../app/model/productShopCart';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Group: ReturnType<typeof ExportGroup>;
    Product: ReturnType<typeof ExportProduct>;
    ProductCategory: ReturnType<typeof ExportProductCategory>;
    ProductShopCart: ReturnType<typeof ExportProductShopCart>;
    User: ReturnType<typeof ExportUser>;
  }
}
