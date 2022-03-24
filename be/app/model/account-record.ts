import { Application } from 'egg';
// import { Model } from 'sequelize';

export default (app: Application) => {
    const { STRING, INTEGER, DOUBLE, DATE } = app.Sequelize;

    const AccountRecord = app.model.define('t_account_record', {
        amount: DOUBLE(),
        account_type_id: {
            type: INTEGER,
            references: {
                model: 't_account_type',
                key: 'id',
            },
        },
        create_time: DATE(),
        remark: STRING(255),
        open_id: STRING(255),
    });

    (AccountRecord as any).associate = function () {
        (app.model.AccountRecord as any).belongsTo(app.model.AccountType, {
            foreignKey: 'account_type_id',
            sourceKey: 'id',
            // targetKey: 'account_type_id',
        });
    };

    return AccountRecord;
};
