import { useMemo } from 'react';
import { PRIZE_TYPE, STORE_NAME } from '@core';
import { useStoreById } from '../base';
import { usePrizeItem } from '../prize';

interface Props {
  id?: string;
}

export function useTaskItem(props: Props) {
  const { id } = props;

  const taskModel = useStoreById(STORE_NAME.TASK, id);
  const prize = usePrizeItem(taskModel?.prizeId);

  const task = useMemo(() => {
    if (!taskModel) {
      return;
    }
    return {
      ...taskModel,
      isCouponReward: prize?.type === PRIZE_TYPE.COUPON,
      isPointsReward: prize?.type === PRIZE_TYPE.POINTS,
      isDrawReward: prize?.type === PRIZE_TYPE.LUCKY_DRAW,
      rewardTitle: prize?.shortDesc ?? '',
    };
  }, [taskModel, prize]);

  return task;
}
