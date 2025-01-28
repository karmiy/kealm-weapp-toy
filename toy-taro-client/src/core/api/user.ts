import { uploadFile } from '@tarojs/taro';
import { UserEntity } from '../entity';
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
  @mock({ name: MOCK_API_NAME.GET_USER_INFO })
  static async getUserInfo(): Promise<UserEntity> {
    return Promise.resolve({} as UserEntity);
  }

  @mock({ name: MOCK_API_NAME.USER_LOGIN })
  static async login(params: LoginParams): Promise<LoginResponse> {
    return Promise.resolve({} as LoginResponse);
  }

  @mock({ name: MOCK_API_NAME.UPLOAD_AVATAR })
  static async uploadAvatar(tempUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      uploadFile({
        url: 'https://your-backend.com/upload', // 后端文件上传接口
        filePath: tempUrl, // 临时路径
        name: 'file', // 文件字段名，后端解析时需要用到
        formData: {
          userId: '12345', // 可附加其他参数
        },
        success: result => {
          resolve(result.data);
        },
        fail: err => {
          reject(err);
        },
      });
    });
  }

  @mock({ name: MOCK_API_NAME.UPLOAD_PROFILE })
  static async uploadProfile(params: { name: string }): Promise<void> {
    return Promise.resolve();
  }
}
