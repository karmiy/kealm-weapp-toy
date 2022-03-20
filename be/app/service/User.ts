import { Service } from 'egg';

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
        const { app } = this;
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
                dataType: 'json',
            },
        );

        if (status !== 200) return Promise.reject(new Error('微信登录接口请求失败'));

        const { session_key, openid, errcode, errmsg } = data;

        if (typeof errcode !== 'undefined') {
            return Promise.reject(new Error(errmsg ?? '微信登录过程中发生未知错误'));
        }

        return {
            sessionKey: session_key,
            openId: openid,
        };
    }
}
