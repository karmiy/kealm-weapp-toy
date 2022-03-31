import { Application } from 'egg';
// import { Model } from 'sequelize';

export default (app: Application) => {
    const { STRING, INTEGER, DECIMAL, DATE } = app.Sequelize;

    const AccountRecord = app.model.define('t_account_record', {
        amount: {
            type: DECIMAL(),
            // 切记，查询时不可配置 raw: true，会使 get 格式化失效
            get() {
                const rawValue = (this as any).getDataValue('amount') as string;
                // 转为时间戳
                return rawValue ? Number(rawValue) : null;
            },
        },
        account_type_id: {
            type: INTEGER,
            references: {
                model: 't_account_type',
                key: 'id',
            },
        },
        create_time: {
            type: DATE(),
            // 切记，查询时不可配置 raw: true，会使 get 格式化失效
            get() {
                const rawValue = (this as any).getDataValue('create_time') as Date;
                // 转为时间戳
                return rawValue ? rawValue.getTime() : null;
            },
        },
        /* create_timestamp: {
            // 虚拟字段
            type: VIRTUAL(),
            get() {
                return 12300;
            },
        }, */
        remark: STRING(255),
        open_id: STRING(255),
    });

    (AccountRecord as any).associate = function () {
        (app.model.AccountRecord as any).belongsTo(app.model.AccountType, {
            foreignKey: 'account_type_id',
            sourceKey: 'id',
            // targetKey: 'id',
            as: 'account_type', // 这里和查询那都需要 as，否则会报错？
        });
    };

    return AccountRecord;
};
