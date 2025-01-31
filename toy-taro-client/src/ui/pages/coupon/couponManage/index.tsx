import { useCallback, useState } from 'react';
import { Picker, View } from '@tarojs/components';
import { navigateBack, useRouter } from '@tarojs/taro';
import { format } from 'date-fns';
import { showToast } from '@shared/utils/operateFeedback';
import { COUPON_TYPE, COUPON_VALIDITY_TIME_TYPE, STORE_NAME } from '@core';
import { Button, CheckButton, Input, PickerSelector, Tag, WhiteSpace } from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { useCoupon, useStoreById } from '@ui/viewModel';
import styles from './index.module.scss';

interface WeeklyItem {
  label: string;
  value: string;
}

const WEEKLY_LIST: WeeklyItem[] = [
  {
    label: '周一',
    value: '1',
  },
  {
    label: '周二',
    value: '2',
  },
  {
    label: '周三',
    value: '3',
  },
  {
    label: '周四',
    value: '4',
  },
  {
    label: '周五',
    value: '5',
  },
  {
    label: '周六',
    value: '6',
  },
  {
    label: '周日',
    value: '7',
  },
];

export default function () {
  const router = useRouter();
  const coupon = useStoreById(STORE_NAME.COUPON, router.params.id);
  const { handleUpdate, isActionLoading } = useCoupon();
  // 名称
  const [couponName, setCouponName] = useState(coupon?.name ?? '');
  // 类型
  const [couponType, setCouponType] = useState(coupon?.type ?? COUPON_TYPE.CASH_DISCOUNT);
  const isCashDiscountType = couponType === COUPON_TYPE.CASH_DISCOUNT;
  const handleSelectCouponType = useCallback((type: COUPON_TYPE, checked: boolean) => {
    if (!checked) {
      return;
    }
    setCouponType(type);
  }, []);
  // 满减金额
  const [couponValue, setCouponValue] = useState<string>(coupon?.value?.toString() ?? '');
  // 最低使用门槛
  const [minimumOrderValue, setMinimumOrderValue] = useState<string>(
    coupon?.minimumOrderValue?.toString() ?? '',
  );
  // 有效时间类型
  const [validityTimeType, setValidityTimeType] = useState(
    coupon?.validityTimeType ?? COUPON_VALIDITY_TIME_TYPE.DATE_RANGE,
  );
  const handleSelectValidityTimeType = useCallback(
    (type: COUPON_VALIDITY_TIME_TYPE, checked: boolean) => {
      if (!checked) {
        return;
      }
      setValidityTimeType(type);
    },
    [],
  );
  // 范围日期
  const [startTime, setStartTime] = useState<string>(() => {
    if (coupon?.validityTime.type !== COUPON_VALIDITY_TIME_TYPE.DATE_RANGE) {
      return '';
    }
    return format(coupon.validityTime.start_time, 'yyyy-MM-dd');
  });
  const [endTime, setEndTime] = useState<string>(() => {
    if (coupon?.validityTime.type !== COUPON_VALIDITY_TIME_TYPE.DATE_RANGE) {
      return '';
    }
    return format(coupon.validityTime.end_time, 'yyyy-MM-dd');
  });
  const handleSelectStartTime = useCallback(
    (value: string) => {
      if (!endTime) {
        setStartTime(value);
        return;
      }
      if (new Date(value).getTime() >= new Date(endTime).getTime()) {
        showToast({
          title: '开始日期需要小于结束日期',
        });
        return;
      }
      setStartTime(value);
    },
    [endTime],
  );
  const handleSelectEndTime = useCallback(
    (value: string) => {
      if (!startTime) {
        setEndTime(value);
        return;
      }
      if (new Date(value).getTime() <= new Date(startTime).getTime()) {
        showToast({
          title: '结束日期需要大于开始日期',
        });
        return;
      }
      setEndTime(value);
    },
    [startTime],
  );

  // 日期集合
  const [dateList, setDateList] = useState<string[]>(() => {
    return coupon?.sortDates.map(date => format(date, 'yyyy-MM-dd')) ?? [];
  });
  const handleSelectDate = useCallback(
    (value: string) => {
      if (dateList.includes(value)) {
        return;
      }
      const list = [...dateList, value].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      );
      setDateList(list);
    },
    [dateList],
  );

  const handleDeleteDate = useCallback(
    (value: string) => {
      const list = dateList.filter(date => date !== value);
      setDateList(list);
    },
    [dateList],
  );

  // 每周
  const [weeklyList, setWeeklyList] = useState<WeeklyItem[]>(() => {
    if (!coupon) {
      return [];
    }
    return coupon.sortDays.map(day => ({
      value: day.toString(),
      label: coupon.getWeeklyLabel(day),
    }));
  });
  const handleSelectWeekly = useCallback(
    (index: number) => {
      const value = WEEKLY_LIST[index].value;
      const week = WEEKLY_LIST.find(item => item.value === value);
      if (!week || weeklyList.find(item => item.value === week.value)) {
        return;
      }
      const list = [...weeklyList, week].sort((a, b) => a.value.localeCompare(b.value));
      setWeeklyList(list);
    },
    [weeklyList],
  );
  const handleDeleteWeekly = useCallback(
    (value: string) => {
      const list = weeklyList.filter(item => item.value !== value);
      setWeeklyList(list);
    },
    [weeklyList],
  );

  const handleSave = useCallback(() => {
    handleUpdate({
      id: coupon?.id,
      name: couponName,
      type: couponType,
      value: couponValue,
      minimumOrderValue,
      validityTimeType,
      startTime,
      endTime,
      dates: dateList,
      days: weeklyList.map(item => Number(item.value)),
      onSuccess: () => navigateBack(),
    });
  }, [
    coupon?.id,
    couponName,
    couponType,
    couponValue,
    dateList,
    endTime,
    handleUpdate,
    minimumOrderValue,
    startTime,
    validityTimeType,
    weeklyList,
  ]);

  return (
    <Layout type='card'>
      <FormItem title='优惠券名称' required>
        <Input
          placeholder='请输入优惠券名称'
          value={couponName}
          onInput={e => setCouponName(e.detail.value)}
        />
      </FormItem>
      <FormItem title='优惠券类型' required>
        <View className={styles.checkButtonWrapper}>
          <CheckButton
            label='满减券'
            checked={couponType === COUPON_TYPE.CASH_DISCOUNT}
            onChange={v => handleSelectCouponType(COUPON_TYPE.CASH_DISCOUNT, v)}
          />
          <WhiteSpace isVertical={false} size='medium' />
          <CheckButton
            label='打折券'
            checked={couponType === COUPON_TYPE.PERCENTAGE_DISCOUNT}
            onChange={v => handleSelectCouponType(COUPON_TYPE.PERCENTAGE_DISCOUNT, v)}
          />
        </View>
      </FormItem>
      <FormItem title={isCashDiscountType ? '满减金额' : '打折比例'} required>
        <Input
          type='number'
          placeholder={isCashDiscountType ? '请输入满减金额' : '请输入打折比例（88 表示 8.8 折）'}
          value={couponValue}
          onInput={e => setCouponValue(e.detail.value)}
        />
      </FormItem>
      <FormItem title='最低使用门槛' required>
        <Input
          type='number'
          placeholder='请输入最低使用门槛（0 表示无门槛）'
          value={minimumOrderValue}
          onInput={e => setMinimumOrderValue(e.detail.value)}
        />
      </FormItem>
      <FormItem title='优惠券有效期' required>
        <View className={styles.checkButtonWrapper}>
          <CheckButton
            label='范围日期'
            checked={validityTimeType === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE}
            onChange={v => handleSelectValidityTimeType(COUPON_VALIDITY_TIME_TYPE.DATE_RANGE, v)}
          />
          <WhiteSpace isVertical={false} size='medium' />
          <CheckButton
            label='日期集合'
            checked={validityTimeType === COUPON_VALIDITY_TIME_TYPE.DATE_LIST}
            onChange={v => handleSelectValidityTimeType(COUPON_VALIDITY_TIME_TYPE.DATE_LIST, v)}
          />
          <WhiteSpace isVertical={false} size='medium' />
          <CheckButton
            label='每周'
            checked={validityTimeType === COUPON_VALIDITY_TIME_TYPE.WEEKLY}
            onChange={v => handleSelectValidityTimeType(COUPON_VALIDITY_TIME_TYPE.WEEKLY, v)}
          />
        </View>
        <WhiteSpace size='small' />
        {validityTimeType === COUPON_VALIDITY_TIME_TYPE.DATE_RANGE ? (
          <>
            <PickerSelector
              placeholder='请选择开始日期'
              type='select'
              mode='date'
              onChange={e => handleSelectStartTime(e.detail.value)}
              value={startTime}
            />
            <WhiteSpace size='small' />
            <PickerSelector
              placeholder='请选择结束日期'
              type='select'
              mode='date'
              onChange={e => handleSelectEndTime(e.detail.value)}
              value={endTime}
            />
          </>
        ) : null}
        {validityTimeType === COUPON_VALIDITY_TIME_TYPE.DATE_LIST ? (
          <View className={styles.tagWrapper}>
            {dateList.map(date => (
              <Tag
                key={date}
                className={styles.tagItem}
                type='outline'
                onDelete={() => handleDeleteDate(date)}
              >
                {date}
              </Tag>
            ))}
            <Picker
              mode='date'
              value={dateList[dateList.length - 1] ?? ''}
              onChange={e => handleSelectDate(e.detail.value)}
            >
              <Tag className={styles.tagItem} type='outline' icon='add'>
                新增
              </Tag>
            </Picker>
          </View>
        ) : null}
        {validityTimeType === COUPON_VALIDITY_TIME_TYPE.WEEKLY ? (
          <View className={styles.tagWrapper}>
            {weeklyList.map(week => (
              <Tag
                key={week.value}
                className={styles.tagItem}
                type='outline'
                onDelete={() => handleDeleteWeekly(week.value)}
              >
                {week.label}
              </Tag>
            ))}
            <Picker
              mode='selector'
              range={WEEKLY_LIST}
              rangeKey='label'
              onChange={e => handleSelectWeekly(e.detail.value as number)}
            >
              <Tag className={styles.tagItem} type='outline' icon='add'>
                新增
              </Tag>
            </Picker>
          </View>
        ) : null}
      </FormItem>
      <Button
        width='100%'
        type='primary'
        size='large'
        onClick={handleSave}
        disabled={isActionLoading}
        loading={isActionLoading}
      >
        保存
      </Button>
    </Layout>
  );
}
