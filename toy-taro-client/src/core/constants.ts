export enum STORE_NAME {
    USER = 'USER',
    PRODUCT = 'PRODUCT',
    PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
    PRODUCT_SHOP_CART = 'PRODUCT_SHOP_CART',
    COUPON = 'COUPON',
}

export enum HANDLER_TYPE {
    SINGLE = 'SINGLE',
    MULTIPLE = 'MULTIPLE',
}

export enum MODULE_NAME {
    USER = 'UserModule',
    PRODUCT = 'ProductModule',
    COUPON = 'CouponModule',
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
