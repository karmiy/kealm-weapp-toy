// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCoupon from '../../../app/model/coupon';
import ExportGroup from '../../../app/model/group';
import ExportProduct from '../../../app/model/product';
import ExportProductCategory from '../../../app/model/productCategory';
import ExportProductShopCart from '../../../app/model/productShopCart';
import ExportTask from '../../../app/model/task';
import ExportTaskCategory from '../../../app/model/taskCategory';
import ExportTaskFlow from '../../../app/model/taskFlow';
import ExportUser from '../../../app/model/user';
import ExportUserCoupon from '../../../app/model/userCoupon';

declare module 'egg' {
  interface IModel {
    Coupon: ReturnType<typeof ExportCoupon>;
    Group: ReturnType<typeof ExportGroup>;
    Product: ReturnType<typeof ExportProduct>;
    ProductCategory: ReturnType<typeof ExportProductCategory>;
    ProductShopCart: ReturnType<typeof ExportProductShopCart>;
    Task: ReturnType<typeof ExportTask>;
    TaskCategory: ReturnType<typeof ExportTaskCategory>;
    TaskFlow: ReturnType<typeof ExportTaskFlow>;
    User: ReturnType<typeof ExportUser>;
    UserCoupon: ReturnType<typeof ExportUserCoupon>;
  }
}
