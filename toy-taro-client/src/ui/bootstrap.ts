import { getApp } from '@tarojs/taro';
import { PAGE_ID } from '@shared/utils/constants';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { ERROR_CODE, sdk } from '@core';
import {
  bootstrap as controllerBootstrap,
  unBootstrap as controllerUnBootstrap,
} from '@ui/controller';

const logger = Logger.getLogger('[bootstrap]');

export const bootstrap = async () => {
  try {
    logger.info('start bootstrap');
    getApp().sdk = sdk;
    await sdk.load();
    await controllerBootstrap();
  } catch (error) {
    switch (error.code) {
      case ERROR_CODE.NO_LOGIN:
      case ERROR_CODE.LOGIN_EXPIRED:
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
    await showToast({ title: '退出成功', awaitClose: true });
    navigateToPage({ pageName: PAGE_ID.LOGIN, isRelaunch: true });
  } catch (error) {
    logger.info('unBootstrap failed', error.message);
    throw error;
  }
};
