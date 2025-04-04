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
  LUCKY_DRAW = "lucky_draw",
}

export enum FILE_NAME_PREFIX {
  USER_AVATAR = "user-avatar",
  PRODUCT_COVER = "product-cover-image",
  LUCKY_DRAW_COVER = "lucky-draw-cover-image",
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
  INSTANT = "INSTANT",
}

export enum TASK_STATUS {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
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

// ------------------------------ prize ------------------------------
export enum PRIZE_TYPE {
  POINTS = "POINTS",
  COUPON = "COUPON",
  LUCKY_DRAW = "LUCKY_DRAW",
  NONE = "NONE",
}

// ----------------------lucky draw--------------------------------
export enum LUCKY_DRAW_TYPE {
  WHEEL = "WHEEL",
  GRID = "GRID",
}
