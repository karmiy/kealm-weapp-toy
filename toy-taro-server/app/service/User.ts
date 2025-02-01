import { Service } from "egg";
import { fn, col } from "sequelize";
import { startOfDay, differenceInDays } from "date-fns";
import { Logger } from "../utils/logger";
import { SERVER_CODE } from "../utils/constants";
import { JsError } from "../utils/error";

const logger = Logger.getLogger("[UserService]");

// 以秒表示或描述时间跨度 zeit / ms 的字符串。如 60，"2 days"，"10h"，"7d"，Expiration time，过期时间
// 如 10 是 10s，'1000' 是 1s
const JWT_EXPIRES_IN = "2d";
/**
 * User Service
 */
export default class User extends Service {
  /**
   * @description 调用微信官方登录
   * @param code 微信 code
   * @return
   */
  public async wxLogin(code: string) {
    const { app, ctx } = this;
    const { AppID, AppSecret } = app;

    const { data, status } = await app.curl<{
      session_key: string;
      openid: string;
      unionid?: string;
      errcode?: number;
      errmsg?: string;
    }>(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`,
      {
        dataType: "json",
      }
    );

    if (status !== SERVER_CODE.OK)
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "微信登录接口请求失败")
      );

    const { session_key, openid, errcode, errmsg } = data;
    logger.tag("[wxLogin]").info("wx response", {
      session_key,
      openid,
      errcode,
      errmsg,
    });

    if (typeof errcode !== "undefined") {
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "无效的微信 code")
      );
    }

    const user = await ctx.model.User.findOne({
      attributes: ["id", "open_id"] as any,
      where: {
        open_id: openid,
      },
      raw: true,
    });
    logger.tag("[wxLogin]").info("find user", user);
    if (!user) {
      return Promise.reject(
        new JsError(SERVER_CODE.NOT_FOUND, "登录用户不存在")
      );
    }
    const { id } = user as any as { id: string };

    const token = app.jwt.sign(
      { userId: id, openId: openid, sessionKey: session_key },
      AppSecret,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return {
      token,
    };
  }

  public async accountLogin(params: { username?: string; password?: string }) {
    const { username = "", password = "" } = params;
    const { app, ctx } = this;
    const { AppSecret } = app;

    const user = await ctx.model.User.findOne({
      attributes: ["id", "username", "password"] as any,
      where: {
        username,
        password,
      },
      raw: true,
    });
    logger.tag("[accountLogin]").info("find user", user);
    if (!user) {
      return Promise.reject(new JsError(SERVER_CODE.NOT_FOUND, "登录密码错误"));
    }
    const { id } = user as any as {
      id: string;
    };

    const token = app.jwt.sign({ userId: id, username, password }, AppSecret, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      token,
    };
  }

  public async getUserAccountStatistics(conditions: { open_id: string }) {
    const { ctx } = this;
    const { open_id } = conditions;

    const data = await ctx.model.AccountRecord.findOne({
      attributes: [
        fn("MIN", col("create_time")),
        fn("MAX", col("create_time")),
        fn("COUNT", "*"),
      ] as any,
      where: {
        open_id,
      },
      fieldMap: {
        "MIN(`create_time`)": "min_create_time",
        "MAX(`create_time`)": "max_create_time",
        "COUNT('*')": "count",
      },
      raw: true,
    });
    const { min_create_time, max_create_time, count } = { ...data } as any as {
      min_create_time: string | null;
      max_create_time: string | null;
      count: number;
    };

    const statistics = {
      usage_days: 0,
      account_days: 0,
      account_count: count,
    };

    if (min_create_time) {
      statistics.usage_days =
        differenceInDays(new Date(), startOfDay(new Date(min_create_time))) + 1;
    }

    if (max_create_time && min_create_time) {
      statistics.account_days =
        differenceInDays(
          startOfDay(new Date(max_create_time)),
          startOfDay(new Date(min_create_time))
        ) + 1;
    }

    return statistics;
  }
}
