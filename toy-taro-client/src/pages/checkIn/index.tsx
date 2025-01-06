import { useCallback, useMemo, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { Button, Calendar, WhiteSpace } from '@/components';
import { Undefinable } from '@/types';
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

  const handleCheckIn = useCallback(() => {
    setMarkDates(prev => [...prev, today]);
    setSelectedDate(undefined);
    setHasCheckIn(true);
  }, [today]);

  return (
    <View className={styles.wrapper}>
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
    </View>
  );
}
