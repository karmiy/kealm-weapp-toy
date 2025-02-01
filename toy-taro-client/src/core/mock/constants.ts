export enum MOCK_API_NAME {
    // user
    GET_USER_INFO = 'GET_USER_INFO',
    USER_LOGIN = 'USER_LOGIN',
    UPLOAD_AVATAR = 'UPLOAD_AVATAR',
    UPLOAD_PROFILE = 'UPLOAD_PROFILE',
    // product
    GET_PRODUCT_LIST = 'GET_PRODUCT_LIST',
    GET_PRODUCT_CATEGORY_LIST = 'GET_PRODUCT_CATEGORY_LIST',
    GET_PRODUCT_SHOP_CART = 'GET_PRODUCT_SHOP_CART',
    UPDATE_PRODUCT_SHOP_CART = 'UPDATE_PRODUCT_SHOP_CART',
    UPDATE_PRODUCT = 'UPDATE_PRODUCT',
    UPDATE_PRODUCT_CATEGORY = 'UPDATE_PRODUCT_CATEGORY',
    // coupon
    GET_COUPON_LIST = 'GET_COUPON_LIST',
    DELETE_COUPON = 'DELETE_COUPON',
    UPDATE_COUPON = 'UPDATE_COUPON',
    // task
    GET_TASK_LIST = 'GET_TASK_LIST',
    GET_TASK_FLOW_LIST = 'GET_TASK_FLOW_LIST',
    GET_TASK_CATEGORY_LIST = 'GET_TASK_CATEGORY_LIST',
    SUBMIT_APPROVAL_REQUEST = 'SUBMIT_APPROVAL_REQUEST',
    UPDATE_TASK_FLOW_STATUS = 'UPDATE_TASK_FLOW_STATUS',
    UPDATE_TASK = 'UPDATE_TASK',
    UPDATE_TASK_CATEGORY = 'UPDATE_TASK_CATEGORY',
    // order
    GET_ORDER_LIST = 'GET_ORDER_LIST',
    UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS',
    // checkIn
    GET_CHECK_IN_INFO = 'GET_CHECK_IN_INFO',
    CLAIM_REWARD = 'CLAIM_REWARD',
    CHECK_IN_TODAY = 'CHECK_IN_TODAY',
}