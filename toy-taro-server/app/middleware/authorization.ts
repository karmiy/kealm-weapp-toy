import { Context, EggAppConfig } from "egg";
import { ERROR_MESSAGE, RESPONSE_STATUS } from "../utils/constants";
// interface VerifyError {
//     name: string;
//     message: string;
//     expiredAt: Date;
// }

export default function AuthorizationMiddleware(options: EggAppConfig) {
  const { ignorePaths = [] } = options;

  return async (ctx: Context, next: () => Promise<any>) => {
    const auth = ctx.get("Authorization");
    const path = ctx.path;

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
      // const error = _error as VerifyError;
      // if (error.name === 'TokenExpiredError') {
      //     ctx.status = RESPONSE_STATUS['Token 失效'];
      //     ctx.body = {
      //         data: {},
      //         message: ERROR_MESSAGE['Token 失效'],
      //     };
      //     return;
      // }
      ctx.status = RESPONSE_STATUS["Token 失效"];
      ctx.body = {
        data: {},
        message: ERROR_MESSAGE["Token 失效"],
      };
      return;
    }
    await next();
  };
}
