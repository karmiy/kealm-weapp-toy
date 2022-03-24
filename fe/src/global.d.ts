declare namespace ModelNS {
    interface AccountType {
        id: number;
        name: string;
        accountMode: number;
    }

    interface AccountRecord {
        id: number;
        amount: number;
        accountType: number;
        createTime: Date;
        remark?: string;
    }
}
