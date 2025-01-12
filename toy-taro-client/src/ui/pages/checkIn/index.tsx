import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { Undefinable } from '@shared/types';
import { Button, Calendar, SafeAreaBar } from '@ui/components';
import { RewardItem } from './rewardItem';
import styles from './index.module.scss';

function getDatesFromTodayToFirst(target: Date) {
  const dates: Date[] = [];

  // 获取本月第一天
  const firstDay = new Date(target.getFullYear(), target.getMonth(), 1);

  // 从今天开始循环到第一天
  const current = new Date(target);
  current.setDate(current.getDate() - 1);
  while (current >= firstDay) {
    dates.push(new Date(current)); // 添加当前日期（拷贝以防止引用）
    current.setDate(current.getDate() - 1); // 日期减 1
  }

  return dates;
}

export default function () {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Undefinable<Date>>(today);
  const [markDates, setMarkDates] = useState(getDatesFromTodayToFirst(today));
  const [hasCheckIn, setHasCheckIn] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const handleCheckIn = useCallback(() => {
    setMarkDates(prev => [...prev, today]);
    setSelectedDate(undefined);
    setHasCheckIn(true);
  }, [today]);

  return (
    <ScrollView scrollY className={styles.wrapper}>
      <View className={styles.checkInRecord}>
        <View className={styles.header}>
          <View className={styles.info}>
            <Text>已签到</Text>
            <Text className={styles.day}>{markDates.length}天</Text>
          </View>
          <Button
            className={styles.checkInBtn}
            circle={false}
            onClick={handleCheckIn}
            disabled={hasCheckIn}
          >
            {hasCheckIn ? '已签到' : '签到打卡'}
          </Button>
        </View>
        <View className={styles.calendar}>
          <Calendar value={selectedDate} markDates={markDates} />
        </View>
      </View>
      <View className={styles.checkInReward}>
        <Text className={styles.title}>签到奖励</Text>
        <RewardItem
          total={3}
          current={8}
          rewardInfo='5积分'
          onReceive={() => setIsToastOpen(true)}
        />
        <RewardItem total={7} current={8} rewardInfo='满100减10积分优惠券' />
        <RewardItem total={15} current={8} rewardInfo='满100减30积分优惠券' />
        <RewardItem total={30} current={8} rewardInfo='5折优惠券  ' />
      </View>
      <AtToast isOpened={isToastOpen} onClose={() => setIsToastOpen(false)} text='领取成功！' />
      <SafeAreaBar inset='bottom' />
    </ScrollView>
  );
}
