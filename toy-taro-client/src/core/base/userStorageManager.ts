import { getStorageSync, removeStorageSync, setStorageSync } from '@tarojs/taro';
import { Undefinable } from '@shared/types';
import { getStorageKey, Singleton } from '@shared/utils/utils';
import { ROLE, STORE_NAME } from '../constants';
import { UserEntity } from '../entity';
import { storeManager } from '../storeManager';

export class UserStorageManager extends Singleton {
  static identifier = 'UserStorageManager';

  private _authStorageKey = getStorageKey('auth'); // wx.getStorageSync('kealm-storage-toy-client_auth')
  private _userStorageKey = getStorageKey('userEntity'); // wx.getStorageSync('kealm-storage-toy-client_userEntity')

  init() {
    const user = this.getUserInfo();
    if (user) {
      storeManager.refresh(STORE_NAME.USER, user);
    }
    storeManager.subscribe(STORE_NAME.USER, this._handleUserStoreChange);
  }

  dispose() {
    super.dispose();
    storeManager.unsubscribe(STORE_NAME.USER, this._handleUserStoreChange);
    this.clearUserAuth();
    this.clearUserInfo();
  }

  private _handleUserStoreChange = () => {
    const userEntity = storeManager.get(STORE_NAME.USER)?.toEntity();
    userEntity ? this.setUserInfo(userEntity) : this.clearUserInfo();
  };

  setUserAuth(auth: string) {
    setStorageSync(this._authStorageKey, auth);
  }

  getUserAuth() {
    return getStorageSync<Undefinable<string>>(this._authStorageKey);
  }

  clearUserAuth() {
    removeStorageSync(this._authStorageKey);
  }

  setUserInfo(user: UserEntity) {
    setStorageSync(this._userStorageKey, user);
  }

  getUserInfo() {
    return getStorageSync<Undefinable<UserEntity>>(this._userStorageKey);
  }

  get isAdmin() {
    const userInfo = this.getUserInfo();
    return userInfo?.role === ROLE.ADMIN;
  }

  clearUserInfo() {
    removeStorageSync(this._userStorageKey);
  }
}
