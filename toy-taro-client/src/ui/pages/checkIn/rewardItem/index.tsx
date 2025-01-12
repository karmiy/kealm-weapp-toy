import { useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { AtProgress } from 'taro-ui';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import styles from './index.module.scss';

interface RewardItemProps {
  total: number;
  current?: number;
  rewardInfo: string;
  isReceived?: boolean;
  onReceive?: () => void;
}

const RewardItem = (props: RewardItemProps) => {
  const { total, current = 0, rewardInfo, isReceived = false, onReceive } = props;

  const percent = useMemo(() => {
    return Math.min(Math.floor((current / total) * 100), 100);
  }, [current, total]);

  const Status = useMemo(() => {
    if (current < total) {
      return <View className={styles.status}>未达成</View>;
    }

    if (isReceived) {
      return <View className={styles.status}>已领取</View>;
    }

    return (
      <View className={styles.action} onClick={onReceive}>
        领取
      </View>
    );
  }, [current, isReceived, onReceive, total]);

  return (
    <View className={styles.rewardItemWrapper}>
      <View className={styles.header}>
        <Text>连续签到{total}天</Text>
        {Status}
      </View>
      <AtProgress percent={percent} color={COLOR_VARIABLES.COLOR_RED} isHidePercent />
      <Text className={styles.desc}>奖励：{rewardInfo}</Text>
    </View>
  );
};

export { RewardItem };
