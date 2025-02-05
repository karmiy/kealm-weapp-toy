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

export enum FILE_SOURCE_TYPE {
  IMAGES = "images",
}

export enum FILE_MODULE_NAME {
  USER = "user",
  PRODUCT = "product",
}

export enum FILE_NAME_PREFIX {
  USER_AVATAR = "user-avatar",
  PRODUCT_COVER = "product-cover-image",
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

// ------------------------------ task ------------------------------
export enum TASK_TYPE {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  TIMED = "TIMED",
  CHALLENGE = "CHALLENGE",
}

export enum TASK_STATUS {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum TASK_REWARD_TYPE {
  POINTS = "POINTS", // 积分
  CASH_DISCOUNT = "CASH_DISCOUNT",
  PERCENTAGE_DISCOUNT = "PERCENTAGE_DISCOUNT",
}

// ------------------------------ order ------------------------------
export enum PRODUCT_ORDER_STATUS {
  INITIAL = "INITIAL",
  REVOKING = "REVOKING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ------------------------------ check-in ------------------------------
export enum CHECK_IN_RULE_TYPE {
  STREAK = "STREAK", // 连续签到
  CUMULATIVE = "CUMULATIVE", // 累计签到
}

export enum CHECK_IN_RULE_REWARD_TYPE {
  POINTS = "POINTS",
}
