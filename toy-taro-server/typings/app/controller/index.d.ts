// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccount from '../../../app/controller/account';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    account: ExportAccount;
    user: ExportUser;
  }
}
