import { useMemo } from 'react';
import { LUCK_DRAW_PREVIEW_ID, PRIZE_TYPE, STORE_NAME } from '@core';
import { useStoreById } from '../base';
import { usePrizeList } from '../prize';
import { groupByRange, uniqueById } from './utils';

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
    const prizeItemsWithoutNone = uniqueById(
      prizeItems.filter(item => item.prizeType && item.prizeType !== PRIZE_TYPE.NONE),
    );
    const levelPrizeItems = [...prizeItemsWithoutNone].sort((a, b) => a.range - b.range);

    const levelPrizeGroups = groupByRange([...prizeItemsWithoutNone]);

    return {
      ...luckDrawModel,
      prizes: prizeItems,
      levelPrizeItems,
      levelPrizeGroups,
    };
  }, [luckDrawModel, prizeDict]);

  return {
    luckDraw,
    isPreView: id === LUCK_DRAW_PREVIEW_ID,
  };
}
