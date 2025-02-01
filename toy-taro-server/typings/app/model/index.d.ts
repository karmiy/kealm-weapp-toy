// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccountRecord from '../../../app/model/account-record';
import ExportAccountType from '../../../app/model/account-type';

declare module 'egg' {
  interface IModel {
    AccountRecord: ReturnType<typeof ExportAccountRecord>;
    AccountType: ReturnType<typeof ExportAccountType>;
  }
}
