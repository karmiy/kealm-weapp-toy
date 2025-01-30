export enum STORE_NAME {
    USER = 'USER',
    PRODUCT = 'PRODUCT',
    PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
    PRODUCT_SHOP_CART = 'PRODUCT_SHOP_CART',
    COUPON = 'COUPON',
    TASK = 'TASK',
    TASK_FLOW = 'TASK_FLOW',
    TASK_CATEGORY = 'TASK_CATEGORY',
    ORDER = 'ORDER',
    CHECK_IN = 'CHECK_IN',
}

export enum HANDLER_TYPE {
    SINGLE = 'SINGLE',
    MULTIPLE = 'MULTIPLE',
}

export enum MODULE_NAME {
    USER = 'UserModule',
    PRODUCT = 'ProductModule',
    COUPON = 'CouponModule',
    TASK = 'TaskModule',
    ORDER = 'OrderModule',
    CHECK_IN = 'CheckInModule',
}

export enum MODULE_WEIGHT {
    HIGH,
    NORMAL,
    LOW
}

// ----------------------error--------------------------------
export enum SERVER_ERROR_CODE {
    LOGIN_EXPIRED = 401,
}

export enum ERROR_CODE {
    NO_LOGIN = 'NO_LOGIN',
    LOGIN_EXPIRED = 'LOGIN_EXPIRED',
    NO_USER_INFO = 'NO_USER_INFO',
}

export enum ERROR_MESSAGE {
    NO_LOGIN = '账号未登录',
    LOGIN_EXPIRED = '登录已过期',
    NO_USER_INFO = '用户数据不存在',
}

export enum ROLE {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

// ----------------------coupon--------------------------------
export enum COUPON_STATUS {
    ACTIVE = 'ACTIVE',
    USED = 'USED',
}

export enum COUPON_TYPE {
    CASH_DISCOUNT = 'CASH_DISCOUNT',
    PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
}

export enum COUPON_VALIDITY_TIME_TYPE {
    DATE_RANGE = 'DATE_RANGE',
    DATE_LIST = 'DATE_LIST',
    WEEKLY = 'WEEKLY',
}
// ----------------------task--------------------------------
export enum TASK_TYPE {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    TIMED = 'TIMED',
    CHALLENGE = 'CHALLENGE',
}

export enum TASK_STATUS {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum TASK_REWARD_TYPE {
    POINTS = 'POINTS', // 积分
    CASH_DISCOUNT = 'CASH_DISCOUNT',
    PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
}

// ----------------------order--------------------------------
export enum ORDER_STATUS {
    INITIAL = 'INITIAL',
    Revoking = 'Revoking',
}

// ----------------------checkIn--------------------------------
export enum CHECK_IN_RULE_TYPE {
    STREAK = 'STREAK', // 连续签到
    CUMULATIVE = 'CUMULATIVE', // 累计签到
}

export enum CHECK_IN_RULE_REWARD_TYPE {
    POINTS = 'POINTS', // 积分
    CASH_DISCOUNT = 'CASH_DISCOUNT',
    PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
}