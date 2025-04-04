export enum STORE_NAME {
    USER = 'USER',
    CONTACT = 'CONTACT',
    PRODUCT = 'PRODUCT',
    PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
    PRODUCT_SHOP_CART = 'PRODUCT_SHOP_CART',
    COUPON = 'COUPON',
    USER_COUPON = 'USER_COUPON',
    TASK = 'TASK',
    TASK_FLOW = 'TASK_FLOW',
    TASK_CATEGORY = 'TASK_CATEGORY',
    ORDER = 'ORDER',
    CHECK_IN = 'CHECK_IN',
    PRIZE = 'PRIZE',
    LUCKY_DRAW = 'LUCKY_DRAW',
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
    PRIZE = 'PrizeModule',
    LUCKY_DRAW = 'LuckyDrawModule',
}

export enum MODULE_WEIGHT {
    HIGH,
    NORMAL,
    LOW
}

export const EVENT_KEYS = {
    user: {
        SYNC_USER_INFO: 'SYNC_USER_INFO',
    },
    product: {
        SYNC_PRODUCT_LIST: 'SYNC_PRODUCT_LIST',
    }
}

// ----------------------error--------------------------------
export enum SERVER_ERROR_CODE {
    NO_LOGIN = 401,
    LOGIN_EXPIRED = 401,
    SERVER_ERROR = 500,
}

// export enum ERROR_CODE {
//     NO_LOGIN = 'NO_LOGIN',
//     LOGIN_EXPIRED = 'LOGIN_EXPIRED',
//     NO_USER_INFO = 'NO_USER_INFO',
// }

export enum ERROR_MESSAGE {
    NO_LOGIN = '账号未登录',
    LOGIN_EXPIRED = '登录已过期',
    NO_USER_INFO = '用户数据不存在',
    UNKNOWN_ERROR = '请求过程中发送未知错误',
    REQUEST_FAILED = '请求失败',
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
    INSTANT = 'INSTANT',
}

export enum TASK_STATUS {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export const TASK_TYPE_LABEL = {
    [TASK_TYPE.DAILY]: '每日任务',
    [TASK_TYPE.WEEKLY]: '每周任务',
    [TASK_TYPE.TIMED]: '限时任务',
    [TASK_TYPE.INSTANT]: '即时任务',
};


export const TASK_TYPE_LIST = [
    {
      type: TASK_TYPE.DAILY,
      label: TASK_TYPE_LABEL[TASK_TYPE.DAILY],
    },
    {
      type: TASK_TYPE.WEEKLY,
      label: TASK_TYPE_LABEL[TASK_TYPE.WEEKLY],
    },
    {
      type: TASK_TYPE.TIMED,
      label: TASK_TYPE_LABEL[TASK_TYPE.TIMED],
    },
    {
      type: TASK_TYPE.INSTANT,
      label: TASK_TYPE_LABEL[TASK_TYPE.INSTANT],
    },
];

// ----------------------order--------------------------------
export enum ORDER_STATUS {
    INITIAL = 'INITIAL',
    REVOKING = 'REVOKING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
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

// ----------------------prize--------------------------------
export enum PRIZE_TYPE {
    POINTS = 'POINTS',
    COUPON = 'COUPON',
    LUCKY_DRAW = 'LUCKY_DRAW',
    NONE = 'NONE',
}

// ----------------------lucky draw--------------------------------
export enum LUCKY_DRAW_TYPE {
    WHEEL = 'WHEEL',
    GRID = 'GRID',
}

export const LUCK_DRAW_PREVIEW_ID = 'LUCK_DRAW_PREVIEW_ID';