import { Context } from "egg";

function getParams<T>(this: Context): T;
function getParams<T = string>(this: Context, key: string): T | undefined;
function getParams<T>(this: Context, key?: string): T | undefined {
  const { method } = this.request;

  switch (method) {
    case "GET":
      if (key) return this.query[key] as any as T;

      return (this.query ?? {}) as any as T;
    case "POST":
      if (key) return this.request.body[key] as any as T;

      return (this.request.body ?? {}) as any as T;
    default:
      return;
  }
}

export default {
  getParams,
  getOpenId(this: Context) {
    const auth = this.get("Authorization");

    const payload = this.app.jwt.decode(auth) as any as {
      userId?: string;
      openId?: string;
      sessionKey?: string;
      username?: string;
      password?: string;
    };

    return payload.openId;
  },
  getUserId(this: Context) {
    const auth = this.get("Authorization");

    const payload = this.app.jwt.decode(auth) as any as {
      userId?: string;
      openId?: string;
      sessionKey?: string;
      username?: string;
      password?: string;
    };

    return payload.userId;
  },
};
