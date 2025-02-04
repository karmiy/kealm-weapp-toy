// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCoupon from '../../../app/controller/coupon';
import ExportOrder from '../../../app/controller/order';
import ExportProduct from '../../../app/controller/product';
import ExportTask from '../../../app/controller/task';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    coupon: ExportCoupon;
    order: ExportOrder;
    product: ExportProduct;
    task: ExportTask;
    user: ExportUser;
  }
}
