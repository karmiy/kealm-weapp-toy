// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthorization from '../../../app/middleware/authorization';
import ExportGuardParams from '../../../app/middleware/guard-params';

declare module 'egg' {
  interface IMiddleware {
    authorization: typeof ExportAuthorization;
    guardParams: typeof ExportGuardParams;
  }
}
