export enum RESPONSE_STATUS {
    '成功' = 200,
    '前端错误' = 400,
    'Token 失效' = 401,
    '服务端错误' = 500,
}

export enum ERROR_MESSAGE {
    '参数' = '参数错误',
    '请求' = '请求过程中发生未知错误',
}

export enum SUCCESS_MESSAGE {
    '请求' = '请求成功',
    '删除' = '删除成功',
    '登录' = '登录成功',
}
