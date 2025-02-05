import { Controller } from "egg";
import {
  FILE_SOURCE_TYPE,
  FILE_MODULE_NAME,
  FILE_NAME_PREFIX,
  SERVER_CODE,
} from "../utils/constants";
import { Logger } from "../utils/logger";
import { UserEntity } from "../entity/user";

const logger = Logger.getLogger("[UserController]");

export default class UserController extends Controller {
  public async login() {
    const { ctx } = this;
    try {
      const params = ctx.getParams<{
        code?: string;
        username?: string;
        password?: string;
      }>();
      logger.tag("[login]").info(params);
      const { code, username, password } = params;

      if (!code && !username) {
        logger.tag("[login]").error("login error, miss wx code or username");
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少微信 code 或用户名",
        });
        return;
      }

      const data = await (code
        ? ctx.service.user.wxLogin(code)
        : ctx.service.user.accountLogin({ username, password }));

      logger.tag("[login]").info("login success", data);

      ctx.responseSuccess({
        data,
        message: "登录成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      logger.tag("[login]").error("login error", jsError.message);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async uploadAvatar() {
    // 微信开发者工具在控制台：
    // 检测头像是否还有效：
    // wx.getFileSystemManager().access({
    //   path: "http://tmp/Z01DFVZcCu7ee347a1d2be702c6ff02f66733e996e21.jpeg",
    //   success: () => console.log("文件存在"),
    //   fail: () => console.error("文件路径无效"),
    // });
    // 上传头像测试：
    // wx.uploadFile({
    //   url: "http://localhost:7001/v1/toy/user/uploadAvatar", // 你的后端接口
    //   filePath: "http://tmp/Z01DFVZcCu7ee347a1d2be702c6ff02f66733e996e21.jpeg", // 临时文件路径
    //   name: "file", // 后端接收的字段
    //   formData: {
    //     userId: "123", // 可附带其他参数
    //   },
    //   header: {
    //     "Content-Type": "multipart/form-data",
    //     "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoieWFubmllIiwicGFzc3dvcmQiOiIxMjExIiwiaWF0IjoxNzM4NDczMjkxLCJleHAiOjE3Mzg2NDYwOTF9.dUzhbz9oc2ovplfymt2e91t7fIvqDZonBpGLKafkFKc`
    //   },
    //   success: (res) => {
    //     console.log("上传成功", res);
    //   },
    //   fail: (err) => {
    //     console.error("上传失败", err);
    //   },
    // });
    const { ctx, app } = this;
    try {
      const { userId, groupId } = ctx.getUserInfo();

      const file = ctx.request.files?.[0];
      logger.tag("[uploadAvatar]").info({ hasFile: !!file });

      if (!file) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少头像文件，请重新选择",
        });
        return;
      }

      const user = await ctx.service.user.findUserById(userId);
      logger.tag("[uploadAvatar]").info("user", user);

      const fileData = await app.uploadFile({
        file,
        sourceType: FILE_SOURCE_TYPE.IMAGES,
        moduleName: FILE_MODULE_NAME.USER,
        groupId,
        userId,
        fileNamePrefix: FILE_NAME_PREFIX.USER_AVATAR,
      });

      const newAvatarUrl = fileData!.filename;
      const oldAvatarUrl = user!.avatar_url;
      logger
        .tag("[uploadAvatar]")
        .info("avatarUrl", { newAvatarUrl, oldAvatarUrl });

      await ctx.service.user.updateUserById(userId, {
        avatar_url: newAvatarUrl,
      });

      oldAvatarUrl && app.deleteFile({ fileUrl: oldAvatarUrl });

      ctx.responseSuccess({
        data: { avatarUrl: newAvatarUrl },
        message: "上传头像成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      logger
        .tag("[uploadAvatar]")
        .error("upload avatar error", jsError.message);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async getUserInfo() {
    const { ctx } = this;
    try {
      const { userId } = ctx.getUserInfo();
      const user = await ctx.service.user.findUserById(userId);

      const userEntity: UserEntity = {
        id: user.id,
        name: user.username,
        avatarUrl: user.avatar_url,
        role: user.role,
        score: user.score,
      };

      ctx.responseSuccess({
        data: ctx.helper.cleanEmptyFields(userEntity),
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      logger.tag("[getUserInfo]").error("get user info error", jsError.message);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async uploadProfile() {
    const { ctx } = this;
    try {
      const { userId } = ctx.getUserInfo();
      const { name } = ctx.getParams<{ name: string }>();

      if (!name) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少用户名",
        });
        return;
      }

      await ctx.service.user.updateUserById(userId, {
        username: name,
      });

      ctx.responseSuccess({
        message: "修改用户名成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      logger
        .tag("[uploadProfile]")
        .error("upload profile error", jsError.message);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }
}
