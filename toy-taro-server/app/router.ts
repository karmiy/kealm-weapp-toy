import { Application } from "egg";

const getPath = (path: string) => `/v1/accounts${path}`;

export default (app: Application) => {
  const { controller, router } = app;

  router.post(getPath("/user/login"), controller.user.login);
  // router.get(
  //   getPath("/user/getAccountStatistics"),
  //   controller.user.getAccountStatistics
  // );

  // router.get(getPath("/account/getTypeList"), controller.account.getTypeList);
  // router.post(
  //   getPath("/account/addOrUpdateRecord"),
  //   controller.account.addOrUpdateRecord
  // );
  // router.get(getPath("/account/getRecords"), controller.account.getRecords);
  // router.get(
  //   getPath("/account/getStatistics"),
  //   controller.account.getStatistics
  // );
  // router.get(
  //   getPath("/account/getTypeExpenditureStatistics"),
  //   controller.account.getTypeExpenditureStatistics
  // );
  // router.get(
  //   getPath("/account/getRecordById"),
  //   controller.account.getRecordById
  // );
  // router.post(
  //   getPath("/account/destroyRecordById"),
  //   controller.account.destroyRecordById
  // );
};
