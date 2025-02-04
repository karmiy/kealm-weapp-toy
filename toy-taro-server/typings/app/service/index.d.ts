// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportCheckIn from '../../../app/service/CheckIn';
import ExportCoupon from '../../../app/service/Coupon';
import ExportOrder from '../../../app/service/Order';
import ExportProduct from '../../../app/service/Product';
import ExportTask from '../../../app/service/Task';
import ExportUser from '../../../app/service/User';

declare module 'egg' {
  interface IService {
    checkIn: AutoInstanceType<typeof ExportCheckIn>;
    coupon: AutoInstanceType<typeof ExportCoupon>;
    order: AutoInstanceType<typeof ExportOrder>;
    product: AutoInstanceType<typeof ExportProduct>;
    task: AutoInstanceType<typeof ExportTask>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
