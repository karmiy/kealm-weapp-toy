import { Controller } from "egg";
import { SERVER_CODE } from "../utils/constants";
import { Logger } from "../utils/logger";

const logger = Logger.getLogger("[UserController]");

export default class UserController extends Controller {
  public async login() {
    const { ctx } = this;
    const params =
      ctx.getParams<{ code?: string; username?: string; password?: string }>();
    logger.tag("[login]").info(params);
    const { code, username, password } = params;

    if (!code && !username) {
      logger.tag("[login]").error("login error, miss wx code or username");
      ctx.status = SERVER_CODE.BAD_REQUEST;
      ctx.body = {
        data: {},
        message: "缺少微信 code 或用户名",
      };
      return;
    }

    const [data, err] = await ctx.helper.asyncWrapper(
      code
        ? ctx.service.user.wxLogin(code)
        : ctx.service.user.accountLogin({ username, password })
    );

    if (err) {
      const { status, message } = ctx.helper.getErrorResponse(err.res);
      logger.tag("[login]").error("login error", { status, message });
      ctx.status = status;
      ctx.body = {
        data: {},
        message,
      };
      return;
    }

    if (!data) {
      logger.tag("[login]").error("login error, not data");
      ctx.status = SERVER_CODE.INTERNAL_SERVER_ERROR;
      ctx.body = {
        data: {},
        message: "微信登录过程中发生未知错误",
      };
      return;
    }

    logger.tag("[login]").info("login success", data);

    ctx.status = SERVER_CODE.OK;
    ctx.body = {
      data,
      message: "登录成功",
    };
  }
}
