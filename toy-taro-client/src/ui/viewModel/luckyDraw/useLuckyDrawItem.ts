import { useMemo } from 'react';
import { PRIZE_TYPE, STORE_NAME } from '@core';
import { useStoreById } from '../base';
import { usePrizeList } from '../prize';

interface Props {
  id?: string;
}

const PRIZE_TYPE_MAP = {
  [PRIZE_TYPE.COUPON]: 'coupon' as const,
  [PRIZE_TYPE.POINTS]: 'points' as const,
  [PRIZE_TYPE.NONE]: 'none' as const,
};

export function useLuckyDrawItem(props: Props) {
  const { id } = props;
  const luckDrawModel = useStoreById(STORE_NAME.LUCKY_DRAW, id);
  const { prizeDict } = usePrizeList({ includeNone: true, includeLuckyDraw: false });

  const luckDraw = useMemo(() => {
    if (!luckDrawModel) {
      return;
    }
    const prizeItems = luckDrawModel.list.map(item => {
      const prizeId = item.prize_id;
      const prize = prizeDict.get(prizeId);
      const text = prize?.terseDesc ?? 'N/A';
      const type =
        (prize ? (PRIZE_TYPE_MAP[prize.type] as 'coupon' | 'points' | 'none') : undefined) ??
        'none';
      return {
        id: item.prize_id,
        text,
        type,
        prizeType: prize?.type,
        range: item.range,
        detailDesc: prize?.detailDesc,
        shortDesc: prize?.shortDesc,
      };
    });
    const levelPrizeItems = [...prizeItems]
      .filter(item => item.prizeType && item.prizeType !== PRIZE_TYPE.NONE)
      .sort((a, b) => a.range - b.range);
    return {
      ...luckDrawModel,
      prizes: prizeItems,
      levelPrizeItems,
    };
  }, [luckDrawModel, prizeDict]);

  return {
    luckDraw,
  };
}
