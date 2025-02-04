// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCheckIn from '../../../app/controller/checkIn';
import ExportCoupon from '../../../app/controller/coupon';
import ExportOrder from '../../../app/controller/order';
import ExportProduct from '../../../app/controller/product';
import ExportTask from '../../../app/controller/task';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    checkIn: ExportCheckIn;
    coupon: ExportCoupon;
    order: ExportOrder;
    product: ExportProduct;
    task: ExportTask;
    user: ExportUser;
  }
}
