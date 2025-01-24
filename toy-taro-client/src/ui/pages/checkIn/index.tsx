import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { Undefinable } from '@shared/types';
import { sdk } from '@core';
import { Button, Calendar, SafeAreaBar } from '@ui/components';
import { useOperateFeedback, withOperateFeedback } from '@ui/hoc';
import { useCheckIn } from '@ui/viewModel';
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

function CheckIn() {
  const { checkInInfo, claimReward, checkInToday } = useCheckIn();
  const today = useMemo(() => new Date(), []);
  const hasCheckIn = useMemo(() => {
    return checkInInfo?.days.includes(today.getDate());
  }, [checkInInfo?.days, today]);

  const RewardList = useMemo(() => {
    return checkInInfo?.ruleList.map(rule => {
      return <RewardItem key={rule.id} {...rule} onClaimReward={() => claimReward(rule.id)} />;
    });
  }, [checkInInfo?.ruleList, claimReward]);

  return (
    <ScrollView scrollY className={styles.wrapper}>
      <View className={styles.checkInRecord}>
        <View className={styles.header}>
          <View className={styles.info}>
            <Text>已签到</Text>
            <Text className={styles.day}>{checkInInfo?.days.length ?? 0}天</Text>
          </View>
          <Button
            className={styles.checkInBtn}
            circle={false}
            onClick={checkInToday}
            disabled={hasCheckIn}
          >
            {hasCheckIn ? '已签到' : '签到打卡'}
          </Button>
        </View>
        <View className={styles.calendar}>
          <Calendar
            value={!hasCheckIn ? today : undefined}
            markDates={checkInInfo?.markDates ?? []}
          />
        </View>
      </View>
      <View className={styles.checkInReward}>
        <Text className={styles.title}>签到奖励</Text>
        {RewardList}
      </View>
      <SafeAreaBar inset='bottom' />
    </ScrollView>
  );
}

const CheckInPage = withOperateFeedback(CheckIn, { enableToast: true });

export default CheckInPage;
