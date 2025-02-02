import { Application } from "egg";

const getPath = (path: string) => `/v1/toy${path}`;

export default (app: Application) => {
  const { controller, router } = app;

  // user
  router.post(getPath("/user/login"), controller.user.login);
  router.post(getPath("/user/uploadAvatar"), controller.user.uploadAvatar);
  router.post(getPath("/user/uploadProfile"), controller.user.uploadProfile);
  router.get(getPath("/user/getUserInfo"), controller.user.getUserInfo);

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
};
