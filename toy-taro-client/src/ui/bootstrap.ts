import { getApp } from '@tarojs/taro';
import { PAGE_ID } from '@shared/utils/constants';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { sdk, SERVER_ERROR_CODE } from '@core';
import {
  bootstrap as controllerBootstrap,
  unBootstrap as controllerUnBootstrap,
} from '@ui/controller';
import { JsError } from '@/shared/utils/utils';

const logger = Logger.getLogger('[bootstrap]');

const errorFallback = (error: JsError) => {
  switch (error.code) {
    case SERVER_ERROR_CODE.NO_LOGIN:
    case SERVER_ERROR_CODE.LOGIN_EXPIRED:
      navigateToPage({ pageName: PAGE_ID.LOGIN, isRelaunch: true });
      break;
    default:
      logger.error('errorFallback', error.code, error.message);
      break;
  }
};

export const bootstrap = async () => {
  try {
    logger.info('start bootstrap');
    getApp().sdk = sdk;
    sdk.httpRequest.registerErrorFallback(errorFallback);
    await sdk.load();
    await controllerBootstrap();
  } catch (error) {
    switch (error.code) {
      case SERVER_ERROR_CODE.NO_LOGIN:
      case SERVER_ERROR_CODE.LOGIN_EXPIRED:
        navigateToPage({ pageName: PAGE_ID.LOGIN, isRelaunch: true });
        break;
      default:
        logger.error('bootstrap failed', error.message);
        throw error;
    }
  }
};

export const unBootstrap = async () => {
  try {
    logger.info('start unBootstrap');
    await controllerUnBootstrap();
    await sdk.unload();
    sdk.httpRequest.unregisterErrorFallback();
    await showToast({ title: '退出成功' });
    navigateToPage({ pageName: PAGE_ID.LOGIN, isRelaunch: true });
  } catch (error) {
    logger.info('unBootstrap failed', error.message);
    throw error;
  }
};
