import { Context } from "egg";
import { ROLE, SERVER_CODE } from "../utils/constants";
import { JsError } from "../utils/error";

const deserializationGetParamValue = (value: string) => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (value === "undefined") return undefined;

  const num = Number(value.trim());
  if (!isNaN(num) && value.trim() !== "") return num;

  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" || Array.isArray(parsed)) return parsed;
  } catch {
    return value;
  }
  return value;
};

function getParams<T>(this: Context): T;
function getParams<T = string>(this: Context, key: string): T | undefined;
function getParams<T>(this: Context, key?: string): T | undefined {
  const { method } = this.request;

  switch (method) {
    case "GET": {
      if (key) {
        const rawValue = this.query[key];
        return rawValue !== undefined
          ? (deserializationGetParamValue(rawValue) as T)
          : undefined;
      }

      const deserializedQuery = Object.keys(this.query ?? {}).reduce(
        (acc, k) => {
          acc[k] = deserializationGetParamValue(this.query[k] as string);
          return acc;
        },
        {} as Record<string, any>
      );

      return deserializedQuery as T;
    }
    case "POST":
      if (key) return this.request.body[key] as any as T;

      return (this.request.body ?? {}) as any as T;
    default:
      return;
  }
}

export default {
  getParams,
  getAuthorization(this: Context) {
    const authorization = this.get("Authorization") ?? "";
    const auth = authorization.replace(/^Bearer\s+/i, "");
    return auth;
  },
  getOpenId(this: Context) {
    const auth = this.getAuthorization();

    const payload = this.app.jwt.decode(auth) as any as {
      userId?: string;
      openId?: string;
      sessionKey?: string;
      username?: string;
      password?: string;
    };

    return payload.openId;
  },
  getUserInfo(this: Context) {
    const auth = this.getAuthorization();

    const payload = this.app.jwt.decode(auth) as any as {
      userId?: string;
      openId?: string;
      sessionKey?: string;
      username?: string;
      password?: string;
      groupId?: string;
      role?: ROLE;
    };

    return {
      userId: payload.userId ?? "",
      groupId: payload.groupId ?? "",
      isAdmin: payload.role === ROLE.ADMIN,
    };
  },
  toJsError(error: unknown, config?: { code?: SERVER_CODE; message?: string }) {
    const { code = SERVER_CODE.INTERNAL_SERVER_ERROR, message = "请求失败" } =
      config ?? {};
    if (error instanceof JsError) {
      return error;
    }

    return new JsError(code, (error as any)?.message ?? message);
  },
  responseSuccess<T>(
    this: Context,
    params: { code?: string | number; data?: T; message?: string }
  ) {
    const { code = SERVER_CODE.OK, data = {}, message = "请求成功" } = params;
    this.status = SERVER_CODE.OK;
    this.body = {
      code: Number(code),
      data,
      message,
    };
  },
  responseFail<T>(
    this: Context,
    params: { code?: string | number; data?: T; message?: string }
  ) {
    const {
      code = SERVER_CODE.INTERNAL_SERVER_ERROR,
      data = {},
      message = "请求失败",
    } = params;
    this.status = SERVER_CODE.OK;
    this.body = {
      code: Number(code),
      data,
      message,
    };
  },
};
