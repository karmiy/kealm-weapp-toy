export enum ACCOUNT_MODE {
    '支出' = 0,
    '收入' = 1,
}

export const ACCOUNT_MODE_LIST = [
    { label: '支出', value: ACCOUNT_MODE.支出 },
    { label: '收入', value: ACCOUNT_MODE.收入 },
];

export enum WEEK {
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
}

export enum STORAGE_KEYS {
    'NAVIGATE_TO_DETAIL' = 'NAVIGATE_TO_DETAIL',
}
