// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCounter from '../../../app/middleware/counter';

declare module 'egg' {
  interface IMiddleware {
    counter: typeof ExportCounter;
  }
}
