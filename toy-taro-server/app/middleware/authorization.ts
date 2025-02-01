import { Context, EggAppConfig } from "egg";
import { SERVER_CODE } from "../utils/constants";
import { Logger } from "../utils/logger";

const logger = Logger.getLogger("[AuthorizationMiddleware]");

export default function AuthorizationMiddleware(options: EggAppConfig) {
  const { ignorePaths = [] } = options;

  return async (ctx: Context, next: () => Promise<any>) => {
    const auth = ctx.get("Authorization");
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
    } catch (_error) {
      ctx.status = SERVER_CODE.UNAUTHORIZED;
      ctx.body = {
        data: {},
        message: "token 已过期",
      };
      return;
    }
    await next();
  };
}
