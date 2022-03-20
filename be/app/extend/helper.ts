enum RESPONSE_STATUS {
    '成功' = 200,
    '前端错误' = 400,
    'Token 失效' = 401,
    '服务端错误' = 500,
}

export default {
    RESPONSE_STATUS,
    base64Encode(str = '') {
        return new Buffer(str).toString('base64');
    },
    asyncWrapper<T>(promise: Promise<T>) {
        return promise
            .then(data => [data, null] as [T, null])
            .catch(err => [null, { res: err }] as [null, { res: any }]);
    },
    isEmpty(value: any): value is undefined | null {
        return typeof value === 'undefined' || value === null;
    },
};
