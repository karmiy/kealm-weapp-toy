// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCoupon from '../../../app/model/coupon';
import ExportGroup from '../../../app/model/group';
import ExportProduct from '../../../app/model/product';
import ExportProductCategory from '../../../app/model/productCategory';
import ExportProductShopCart from '../../../app/model/productShopCart';
import ExportUser from '../../../app/model/user';
import ExportUserCoupon from '../../../app/model/userCoupon';

declare module 'egg' {
  interface IModel {
    Coupon: ReturnType<typeof ExportCoupon>;
    Group: ReturnType<typeof ExportGroup>;
    Product: ReturnType<typeof ExportProduct>;
    ProductCategory: ReturnType<typeof ExportProductCategory>;
    ProductShopCart: ReturnType<typeof ExportProductShopCart>;
    User: ReturnType<typeof ExportUser>;
    UserCoupon: ReturnType<typeof ExportUserCoupon>;
  }
}
