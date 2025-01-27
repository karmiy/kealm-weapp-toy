export enum STORE_NAME {
    USER = 'USER',
    PRODUCT = 'PRODUCT',
    PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
    PRODUCT_SHOP_CART = 'PRODUCT_SHOP_CART',
    COUPON = 'COUPON',
    TASK = 'TASK',
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

export enum ERROR_CODE {
    NO_LOGIN = 'NO_LOGIN',
}

// ----------------------toy--------------------------------
// ----------------------coupon--------------------------------
export enum COUPON_STATUS {
    ACTIVE = 'ACTIVE',
    USED = 'USED',
}

export enum COUPON_TYPE {
    CASH_DISCOUNT = 'CASH_DISCOUNT',
    PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
}

// ----------------------task--------------------------------
export enum TASK_TYPE {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    TIMED = 'TIMED',
    CHALLENGE = 'CHALLENGE',
}

export enum TASK_STATUS {
    INITIAL = 'INITIAL',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
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