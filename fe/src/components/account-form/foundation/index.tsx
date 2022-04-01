import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Picker } from '@tarojs/components';
import { showToast } from '@tarojs/taro';
import { useUpdateEffect } from 'ahooks';
import { format, parseISO } from 'date-fns';
import { isNil } from 'lodash-es';
import { AtForm, AtInput } from 'taro-ui';
import { ListItem } from '@/components';
import { useTypeListStore } from '@/store';
import { ACCOUNT_MODE } from '@/utils/constants';
import styles from './index.module.scss';

interface Props {
    modeSelectable?: boolean;
    defaultFieldsValue?: {
        amount?: number;
        mode?: ACCOUNT_MODE;
        createTime?: number;
        remark?: string;
        accountTypeId?: number;
    };
}

export interface FormRef {
    handleFormValidate: () => boolean;
    handleFormClear: () => void;
    getFields: () => { amount: number; accountType: number; createTime: Date; remark: string };
}

const MODE_LIST = [
    {
        id: ACCOUNT_MODE.支出,
        name: '支出',
    },
    {
        id: ACCOUNT_MODE.收入,
        name: '收入',
    },
];

const MODE_NAMES = MODE_LIST.map(item => item.name);

export default forwardRef<FormRef, Props>((props, ref) => {
    const { modeSelectable = false, defaultFieldsValue } = props;

    /* ------------------------------ Toast ------------------------------ */
    // const [showToast, setShowToast] = useState(false);
    // const [toastText, setToastText] = useState('');

    /* ------------------------------ 金额 ------------------------------ */
    const [amount, setAmount] = useState(() => {
        if (isNil(defaultFieldsValue)) return '';
        if (isNil(defaultFieldsValue.amount)) return '';

        return `${defaultFieldsValue.amount}`;
    });

    /* ------------------------------ 模式 ------------------------------ */
    const [modeIndex, setModeIndex] = useState<number>(() => {
        if (isNil(defaultFieldsValue)) return 0;
        if (isNil(defaultFieldsValue.mode)) return 0;

        const index = MODE_LIST.findIndex(item => item.id === defaultFieldsValue.mode);
        return index;
    });
    const mode = MODE_LIST[modeIndex].id;

    /* ------------------------------ 类别 ------------------------------ */
    const { inComeTypeList, expenditureTypeList } = useTypeListStore();
    const typeList = mode === ACCOUNT_MODE.支出 ? expenditureTypeList : inComeTypeList;
    const typeNames = typeList.map(item => item.name);
    const [typeIndex, setTypeIndex] = useState<number>();

    useEffect(() => {
        const index = typeList.findIndex(item => item.id === defaultFieldsValue?.accountTypeId);
        setTypeIndex(index);
    }, [defaultFieldsValue?.accountTypeId, typeList]);

    useUpdateEffect(() => {
        setTypeIndex(undefined);
    }, [mode]);

    /* ------------------------------ 日期 ------------------------------ */
    const [createDate, setCreateDate] = useState(() => {
        const defaultDate = format(new Date(), 'yyyy-MM-dd');

        if (isNil(defaultFieldsValue)) return defaultDate;
        if (isNil(defaultFieldsValue.createTime)) return defaultDate;

        return format(defaultFieldsValue.createTime, 'yyyy-MM-dd');
    });

    /* ------------------------------ 时间 ------------------------------ */
    const [createTime, setCreateTime] = useState(() => {
        const defaultTime = format(new Date(), 'HH:mm');
        if (isNil(defaultFieldsValue)) return defaultTime;
        if (isNil(defaultFieldsValue.createTime)) return defaultTime;

        return format(defaultFieldsValue.createTime, 'HH:mm');
    });

    /* ------------------------------ 备注 ------------------------------ */
    const [remark, setRemark] = useState(() => {
        if (isNil(defaultFieldsValue)) return '';
        if (isNil(defaultFieldsValue.remark)) return '';

        return defaultFieldsValue.remark;
    });

    /* ------------------------------ ref ------------------------------ */
    const handleFormClear = () => {
        setAmount('');
        setTypeIndex(undefined);
        setCreateDate(format(new Date(), 'yyyy-MM-dd'));
        setCreateTime(format(new Date(), 'HH:mm'));
        setRemark('');
    };

    const handleFormValidate = () => {
        if (!amount) {
            showToast({
                title: '请输入金额',
                icon: 'error',
            });
            return false;
        }

        const accountType = typeList[typeIndex ?? 0];
        if (isNil(typeIndex) || !accountType) {
            showToast({
                title: '请选择类别',
                icon: 'error',
            });
            return false;
        }

        if (!createDate) {
            showToast({
                title: '请选择日期',
                icon: 'error',
            });
            return false;
        }

        if (!createTime) {
            showToast({
                title: '请选择时间',
                icon: 'error',
            });
            return false;
        }

        return true;
    };

    const getFields = () => {
        return {
            amount: Number(amount),
            accountType: typeList[typeIndex ?? 0].id,
            createTime: parseISO(`${createDate} ${createTime}`),
            remark,
        };
    };

    useImperativeHandle(ref, () => ({
        handleFormClear,
        handleFormValidate,
        getFields,
    }));

    return (
        <AtForm className={styles.form}>
            <AtInput
                className='text-right'
                name='account'
                value={amount}
                onChange={(v: string) => setAmount(v)}
                title='金额'
                type='digit'
                placeholder='请输入金额'
            />
            {modeSelectable ? (
                <Picker
                    mode='selector'
                    name='mode'
                    value={modeIndex}
                    range={MODE_NAMES}
                    onChange={e => setModeIndex(e.detail.value as number)}
                >
                    <ListItem
                        title='收支'
                        extraText={!isNil(modeIndex) ? MODE_NAMES[modeIndex] : undefined}
                        placeholder='请选择收支方式'
                        arrow='right'
                    />
                </Picker>
            ) : (
                <ListItem title='收支' extraText={ACCOUNT_MODE[mode]} />
            )}
            <Picker
                mode='selector'
                name='type'
                value={typeIndex}
                range={typeNames}
                onChange={e => setTypeIndex(e.detail.value as number)}
            >
                <ListItem
                    title='类别'
                    extraText={!isNil(typeIndex) ? typeNames[typeIndex] : undefined}
                    placeholder='请选择类别'
                    arrow='right'
                />
            </Picker>
            <Picker
                mode='date'
                name='createDate'
                value={createDate}
                onChange={e => setCreateDate(e.detail.value)}
            >
                <ListItem
                    title='日期'
                    extraText={createDate}
                    placeholder='请选择日期'
                    arrow='right'
                />
            </Picker>
            <Picker
                mode='time'
                name='createTime'
                value={createTime}
                onChange={e => setCreateTime(e.detail.value)}
            >
                <ListItem
                    title='时间'
                    extraText={createTime}
                    placeholder='请选择时间'
                    arrow='right'
                />
            </Picker>
            <AtInput
                className='text-right'
                name='remark'
                value={remark}
                onChange={(v: string) => setRemark(v)}
                title='备注'
                type='text'
                placeholder='请输入备注'
                border={false}
            />
        </AtForm>
    );
});
