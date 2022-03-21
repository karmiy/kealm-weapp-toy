declare namespace ModelNS {
    interface AccountType {
        id: number;
        name: string;
        account_mode: number;
    }

    interface AccountRecord {
        id: number;
        amount: number;
        account_type: number;
        create_time: Date;
        remark?: string;
    }

    interface UserInfo {
        nickName: string;
        avatarUrl: string;
    }
}
