import { useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { AtProgress } from 'taro-ui';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Button } from '@ui/components';
import styles from './index.module.scss';

interface RewardItemProps {
  target: number;
  current?: number;
  ruleTip: string;
  rewardTip: string;
  isClaimed?: boolean;
  onClaimReward?: () => void;
}

const RewardItem = (props: RewardItemProps) => {
  const { target, current = 0, ruleTip, rewardTip, isClaimed = false, onClaimReward } = props;

  const percent = useMemo(() => {
    return Math.min(Math.floor((current / target) * 100), 100);
  }, [current, target]);

  const Status = useMemo(() => {
    if (current < target) {
      return <View className={styles.status}>未达成</View>;
    }

    if (isClaimed) {
      return <View className={styles.status}>已领取</View>;
    }

    return (
      <View className={styles.action} onClick={onClaimReward}>
        领取
      </View>
    );
  }, [current, isClaimed, onClaimReward, target]);

  return (
    <View className={styles.rewardItemWrapper}>
      <View className={styles.header}>
        <Text>{ruleTip}</Text>
        {Status}
      </View>
      <AtProgress percent={percent} color={COLOR_VARIABLES.COLOR_RED} isHidePercent />
      <Text className={styles.desc}>奖励：{rewardTip}</Text>
    </View>
  );
};

export { RewardItem };
