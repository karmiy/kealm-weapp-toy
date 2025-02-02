import { Context, EggAppConfig } from "egg";
import { SERVER_CODE } from "../utils/constants";
import { Logger } from "../utils/logger";

const logger = Logger.getLogger("[AuthorizationMiddleware]");

export default function AuthorizationMiddleware(options: EggAppConfig) {
  const { ignorePaths = [] } = options;

  return async (ctx: Context, next: () => Promise<any>) => {
    const auth = ctx.getAuthorization();
    const path = ctx.path;
    logger.info(`auth: ${auth}, path: ${path}`);

    // 双向判断，可能会有转发
    if (
      ignorePaths.find((item) => item.includes(path) || path.includes(item))
    ) {
      await next();
      return;
    }

    try {
      ctx.app.jwt.verify(auth ?? "", ctx.app.AppSecret);

      const userId = ctx.getUserId();
      if (!userId) {
        logger.error("cannot get userId");
        ctx.responseFail({
          code: SERVER_CODE.UNAUTHORIZED,
          message: "获取用户信息失败，用户未登录",
        });
        return;
      }
    } catch (_error) {
      logger.error(`jwt verify error`, _error);
      ctx.responseFail({
        code: SERVER_CODE.UNAUTHORIZED,
        message: "token 已过期",
      });
      return;
    }
    await next();
  };
}
