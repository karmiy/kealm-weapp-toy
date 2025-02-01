import { Application } from "egg";
// import { Model } from 'sequelize';

export default (app: Application) => {
  const { STRING, INTEGER } = app.Sequelize;

  const AccountType = app.model.define("t_account_type", {
    name: STRING(255),
    /* accountMode: {
            type: INTEGER,
            field: 'account_mode', // 数据库的 account_mode 映射为 accountMode
        }, */
    account_mode: INTEGER,
    open_id: STRING(255),
  });

  /* (AccountType as any).associate = function () {
        (app.model.AccountType as any).hasMany(app.model.AccountRecord, {
            foreignKey: 'account_type_id',
            sourceKey: 'id',
        });
    }; */

  return AccountType;
};
