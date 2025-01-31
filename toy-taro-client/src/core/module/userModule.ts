import { JsError } from '@shared/utils/utils';
import { LoginParams, UserApi } from '../api';
import { AbstractModule, UserStorageManager } from '../base';
import { ERROR_CODE, ERROR_MESSAGE, MODULE_NAME, STORE_NAME } from '../constants';
import { storeManager } from '../storeManager';

export class UserModule extends AbstractModule {
  protected onLoad() {
    UserStorageManager.getInstance().init();
    this.syncUserLoginInfo();
  }
  protected onUnload() {
    UserStorageManager.getInstance().dispose();
  }
  protected moduleName(): string {
    return MODULE_NAME.USER;
  }

  syncUserLoginInfo() {
    this._logger.info('sync user info');
    const auth = UserStorageManager.getInstance().getUserAuth();
    if (!auth) {
      this._logger.error('without login');
      throw new JsError(ERROR_CODE.NO_LOGIN, ERROR_MESSAGE.NO_LOGIN);
    }
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await UserApi.getUserInfo();
    storeManager.emitUpdate(STORE_NAME.USER, {
      entities: [userInfo],
    });
  }

  async login(params: LoginParams) {
    try {
      const { token } = await UserApi.login(params);

      UserStorageManager.getInstance().setUserAuth(token);
    } catch (error) {
      this._logger.error('login failed', error);
      throw error;
    }
  }

  async uploadAvatar(tempUrl: string) {
    // 不再支持 getUserProfile 获取昵称头像了 https://developers.weixin.qq.com/community/develop/doc/00022c683e8a80b29bed2142b56c01
    // 可以单独做个配置页面，用 chooseMedia 和 button 组件的 open-type="chooseAvatar" 让用户选头像， 做个弹框让用户输入昵称
    // 官方推荐：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html
    // mock 本地数据时，清了换成要重启微信开发者工具
    const avatarUrl = await UserApi.uploadAvatar(tempUrl);
    const userInfo = storeManager.get(STORE_NAME.USER);
    if (!userInfo) {
      throw new JsError(ERROR_CODE.NO_USER_INFO, ERROR_MESSAGE.NO_USER_INFO);
    }
    storeManager.emitUpdate(STORE_NAME.USER, {
      partials: [{ id: userInfo.id, avatarUrl }],
    });
  }

  async uploadProfile(params: { name: string }) {
    const { name } = params;
    await UserApi.uploadProfile(params);
    const userInfo = storeManager.get(STORE_NAME.USER);
    if (!userInfo) {
      throw new JsError(ERROR_CODE.NO_USER_INFO, ERROR_MESSAGE.NO_USER_INFO);
    }
    storeManager.emitUpdate(STORE_NAME.USER, {
      partials: [{ id: userInfo.id, name }],
    });
  }

  getIsAdmin() {
    return UserStorageManager.getInstance().isAdmin;
  }
}
