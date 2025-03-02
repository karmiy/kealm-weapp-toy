import { eventCenter } from '@tarojs/taro';
import { JsError } from '@shared/utils/utils';
import { LoginParams, UserApi } from '../api';
import { AbstractModule, UserStorageManager } from '../base';
import {
  ERROR_MESSAGE,
  EVENT_KEYS,
  MODULE_NAME,
  SERVER_ERROR_CODE,
  STORE_NAME,
} from '../constants';
import { storeManager } from '../storeManager';

export class UserModule extends AbstractModule {
  protected onLoad() {
    UserStorageManager.getInstance().init();
    this.syncUserLoginInfo();
    eventCenter.on(EVENT_KEYS.user.SYNC_USER_INFO, this._onSyncUserInfo);

    this.syncContactList();
  }
  protected onUnload() {
    UserStorageManager.getInstance().dispose();
    eventCenter.off(EVENT_KEYS.user.SYNC_USER_INFO, this._onSyncUserInfo);
  }
  protected moduleName(): string {
    return MODULE_NAME.USER;
  }

  private _onSyncUserInfo = () => {
    this.getUserInfo();
  };

  syncUserLoginInfo() {
    this._logger.info('sync user info');
    const auth = UserStorageManager.getInstance().getUserAuth();
    if (!auth) {
      this._logger.error('without login');
      throw new JsError(SERVER_ERROR_CODE.NO_LOGIN, ERROR_MESSAGE.NO_LOGIN);
    }
    this.getUserInfo();
  }

  async getUserInfo(forceRemote = true) {
    try {
      this._logger.info('getUserInfo', {
        forceRemote,
      });
      if (!forceRemote) {
        const userInfo = UserStorageManager.getInstance().getUserInfo();
        if (userInfo) {
          return userInfo;
        }
      }
      const userInfo = await UserApi.getUserInfo();
      storeManager.emitUpdate(STORE_NAME.USER, {
        entities: [userInfo],
      });
    } catch (error) {
      this._logger.error('getUserInfo error', error.message);
      throw error;
    }
  }

  async login(params: LoginParams) {
    try {
      const { token } = await UserApi.login(params);

      UserStorageManager.getInstance().setUserAuth(token);
    } catch (error) {
      this._logger.error('login failed', error.message);
      throw error;
    }
  }

  async uploadAvatar(tempUrl: string) {
    // 不再支持 getUserProfile 获取昵称头像了 https://developers.weixin.qq.com/community/develop/doc/00022c683e8a80b29bed2142b56c01
    // 可以单独做个配置页面，用 chooseMedia 和 button 组件的 open-type="chooseAvatar" 让用户选头像， 做个弹框让用户输入昵称
    // 官方推荐：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html
    // mock 本地数据时，清了换成要重启微信开发者工具
    try {
      this._logger.info('uploadAvatar', tempUrl);
      const { avatarUrl } = await UserApi.uploadAvatar(tempUrl);
      const userInfo = storeManager.get(STORE_NAME.USER);
      if (!userInfo) {
        throw new JsError(SERVER_ERROR_CODE.NO_LOGIN, ERROR_MESSAGE.NO_USER_INFO);
      }
      storeManager.emitUpdate(STORE_NAME.USER, {
        partials: [{ id: userInfo.id, avatarUrl }],
      });
    } catch (error) {
      this._logger.error('uploadAvatar error', error.message);
      throw error;
    }
  }

  async uploadProfile(params: { name: string }) {
    try {
      this._logger.info('uploadProfile', params);
      const { name } = params;
      await UserApi.uploadProfile(params);
      const userInfo = storeManager.get(STORE_NAME.USER);
      if (!userInfo) {
        throw new JsError(SERVER_ERROR_CODE.NO_LOGIN, ERROR_MESSAGE.NO_USER_INFO);
      }
      storeManager.emitUpdate(STORE_NAME.USER, {
        partials: [{ id: userInfo.id, name }],
      });
    } catch (error) {
      this._logger.error('uploadProfile error', error.message);
      throw error;
    }
  }

  getIsAdmin() {
    return UserStorageManager.getInstance().isAdmin;
  }

  getLocalUserInfo() {
    return UserStorageManager.getInstance().getUserInfo();
  }

  async syncContactList() {
    storeManager.startLoading(STORE_NAME.CONTACT);
    const contactList = await UserApi.getContactList();
    storeManager.refresh(STORE_NAME.CONTACT, contactList);
    storeManager.stopLoading(STORE_NAME.CONTACT);
  }
}
