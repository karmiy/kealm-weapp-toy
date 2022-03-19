// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAbout from '../../../app/controller/about';

declare module 'egg' {
  interface IController {
    about: ExportAbout;
  }
}
