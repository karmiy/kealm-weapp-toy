namespace Model {
    interface AccountType {
        id: number;
        name: string;
        account_mode: number;
        open_id: string;
    }

    interface AccountRecord {
        id: number;
        amount: number;
        account_type: number;
        create_time: Date;
        remark?: string;
        open_id: string;
    }
}

type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;