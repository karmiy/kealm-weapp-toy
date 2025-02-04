import { uploadFile } from '@tarojs/taro';
import { UserEntity } from '../entity';
import { httpRequest } from '../httpRequest';
import { mock, MOCK_API_NAME } from '../mock';

export interface LoginParams {
  username?: string;
  password?: string;
  code?: string;
}

export type LoginResponse = {
  token: string;
};

export class UserApi {
  @mock({ name: MOCK_API_NAME.GET_USER_INFO, enable: false })
  static async getUserInfo(): Promise<UserEntity> {
    return httpRequest.get<UserEntity>({
      url: '/user/getUserInfo',
    });
  }

  @mock({ name: MOCK_API_NAME.USER_LOGIN, enable: false })
  static async login(params: LoginParams): Promise<LoginResponse> {
    return httpRequest.post<LoginResponse>({
      url: '/user/login',
      data: params,
    });
  }

  @mock({ name: MOCK_API_NAME.UPLOAD_AVATAR, enable: false })
  static async uploadAvatar(tempUrl: string): Promise<{ avatarUrl: string }> {
    return httpRequest.postFormDataFile<{ avatarUrl: string }>({
      url: '/user/uploadAvatar',
      filePath: tempUrl,
    });
  }

  @mock({ name: MOCK_API_NAME.UPLOAD_PROFILE, enable: false })
  static async uploadProfile(params: { name: string }): Promise<void> {
    return httpRequest.post<void>({
      url: '/user/uploadProfile',
      data: params,
    });
  }
}
