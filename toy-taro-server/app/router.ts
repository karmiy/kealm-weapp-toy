import { Application } from "egg";

const getPath = (path: string) => `/v1/toy${path}`;

export default (app: Application) => {
  const { controller, router } = app;

  // user
  router.post(getPath("/user/login"), controller.user.login);
  router.post(getPath("/user/uploadAvatar"), controller.user.uploadAvatar);
  router.post(getPath("/user/uploadProfile"), controller.user.uploadProfile);
  router.get(getPath("/user/getUserInfo"), controller.user.getUserInfo);
  router.get(getPath("/user/getContactList"), controller.user.getContactList);

  // product
  router.get(
    getPath("/product/getProductCategoryList"),
    controller.product.getProductCategoryList
  );
  router.post(
    getPath("/product/updateProductCategory"),
    controller.product.updateProductCategory
  );
  router.post(
    getPath("/product/deleteProductCategory"),
    controller.product.deleteProductCategory
  );
  router.post(
    getPath("/product/updateProduct"),
    controller.product.updateProduct
  );
  router.get(
    getPath("/product/getProductList"),
    controller.product.getProductList
  );
  router.post(
    getPath("/product/deleteProduct"),
    controller.product.deleteProduct
  );
  router.post(
    getPath("/product/updateProductShopCart"),
    controller.product.updateProductShopCart
  );
  router.post(
    getPath("/product/deleteProductShopCart"),
    controller.product.deleteProductShopCart
  );
  router.get(
    getPath("/product/getProductShopCartList"),
    controller.product.getProductShopCartList
  );

  // coupon
  router.post(getPath("/coupon/updateCoupon"), controller.coupon.updateCoupon);
  router.post(
    getPath("/coupon/updateUserCoupon"),
    controller.coupon.updateUserCoupon
  );
  router.get(getPath("/coupon/getCouponList"), controller.coupon.getCouponList);
  router.get(
    getPath("/coupon/getUserCouponList"),
    controller.coupon.getUserCouponList
  );
  router.post(getPath("/coupon/deleteCoupon"), controller.coupon.deleteCoupon);

  // task
  router.post(
    getPath("/task/updateTaskCategory"),
    controller.task.updateTaskCategory
  );
  router.get(
    getPath("/task/getTaskCategoryList"),
    controller.task.getTaskCategoryList
  );
  router.post(
    getPath("/task/deleteTaskCategory"),
    controller.task.deleteTaskCategory
  );
  router.post(getPath("/task/updateTask"), controller.task.updateTask);
  router.post(getPath("/task/deleteTask"), controller.task.deleteTask);
  router.get(getPath("/task/getTaskList"), controller.task.getTaskList);
  router.post(getPath("/task/updateTaskFlow"), controller.task.updateTaskFlow);
  router.get(getPath("/task/getTaskFlowList"), controller.task.getTaskFlowList);

  // order
  router.post(
    getPath("/order/createProductOrder"),
    controller.order.createProductOrder
  );
  router.get(
    getPath("/order/getProductOrderList"),
    controller.order.getProductOrderList
  );
  router.post(
    getPath("/order/updateProductOrderStatus"),
    controller.order.updateProductOrderStatus
  );

  // checkIn
  router.post(
    getPath("/checkIn/checkInToday"),
    controller.checkIn.checkInToday
  );
  router.post(
    getPath("/checkIn/createCheckInRule"),
    controller.checkIn.createCheckInRule
  );
  router.post(getPath("/checkIn/claimReward"), controller.checkIn.claimReward);
  router.get(
    getPath("/checkIn/getCheckInList"),
    controller.checkIn.getCheckInList
  );

  // prize
  router.post(getPath("/prize/deletePrize"), controller.prize.deletePrize);
  router.get(getPath("/prize/getPrizeList"), controller.prize.getPrizeList);
  router.post(getPath("/prize/updatePrize"), controller.prize.updatePrize);
  router.post(getPath("/prize/sortPrize"), controller.prize.sortPrize);
  router.post(getPath("/prize/grantReward"), controller.prize.grantReward);

  // luckyDraw
  router.get(
    getPath("/luckyDraw/getLuckyDrawList"),
    controller.luckyDraw.getLuckyDrawList
  );
  router.post(
    getPath("/luckyDraw/updateLuckyDraw"),
    controller.luckyDraw.updateLuckyDraw
  );
  router.post(
    getPath("/luckyDraw/deleteLuckyDraw"),
    controller.luckyDraw.deleteLuckyDraw
  );
  router.post(
    getPath("/luckyDraw/startLuckyDraw"),
    controller.luckyDraw.startLuckyDraw
  );
};
