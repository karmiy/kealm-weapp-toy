export enum SERVER_CODE {
  // 成功
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,

  // 客户端错误
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,

  // 服务器错误
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,

  // 其他自定义错误
  UNKNOWN_ERROR = 9999,
}

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum FILE_PREFIX {
  USER_AVATAR = "user-avatar",
  PRODUCT_COVER = "product-cover-image",
}

export enum FILE_SCORE {
  IMAGES = "images",
}

// ------------------------------ coupon ------------------------------
export enum COUPON_STATUS {
  ACTIVE = "ACTIVE",
  USED = "USED",
}

export enum COUPON_TYPE {
  CASH_DISCOUNT = "CASH_DISCOUNT",
  PERCENTAGE_DISCOUNT = "PERCENTAGE_DISCOUNT",
}

export enum COUPON_VALIDITY_TIME_TYPE {
  DATE_RANGE = "DATE_RANGE",
  DATE_LIST = "DATE_LIST",
  WEEKLY = "WEEKLY",
}
