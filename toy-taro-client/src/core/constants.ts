export enum STORE_NAME {
    USER = 'USER',
    PRODUCT = 'PRODUCT',
    PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
    PRODUCT_SHOP_CART = 'PRODUCT_SHOP_CART',
    COUPON = 'COUPON',
    TASK = 'TASK',
    TASK_CATEGORY = 'TASK_CATEGORY',
    ORDER = 'ORDER',
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
}

export enum MODULE_WEIGHT {
    HIGH,
    NORMAL,
    LOW
}

// ----------------------toy--------------------------------
// ----------------------coupon--------------------------------
export enum COUPON_STATUS {
    ACTIVE = 'ACTIVE',
    USED = 'USED',
}

export enum COUPON_TYPE {
    CASH_DISCOUNT = "CASH_DISCOUNT",
    PERCENTAGE_DISCOUNT = "PERCENTAGE_DISCOUNT",
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
    DISCOUNT = 'DISCOUNT', // 打折券
}

// ----------------------order--------------------------------
export enum ORDER_STATUS {
    INITIAL = 'INITIAL',
    Revoking = 'Revoking',
    Revoked = 'Revoked',
}