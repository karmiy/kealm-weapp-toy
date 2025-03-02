import { useMemo, useState } from 'react';
import { PickerSelector } from '@ui/components';
import { usePrizeList } from './usePrizeList';

interface Props {
  defaultValue?: string;
  includeNone?: boolean;
  includeLuckyDraw?: boolean;
}

export function usePrizeSelector(props: Props) {
  const { defaultValue, includeNone, includeLuckyDraw } = props;
  const { activePrizeList } = usePrizeList({ includeNone, includeLuckyDraw });
  const [prizeId, setPrizeId] = useState(defaultValue);

  const prizeIndex = useMemo(() => {
    if (!prizeId) {
      return;
    }
    const index = activePrizeList.findIndex(item => item.id === prizeId);
    return index === -1 ? undefined : index;
  }, [prizeId, activePrizeList]);

  const PrizeSelector = useMemo(() => {
    return (
      <PickerSelector
        placeholder='请选择奖品'
        type='select'
        mode='selector'
        range={activePrizeList}
        rangeKey='detailDesc'
        onChange={e => setPrizeId(activePrizeList[Number(e.detail.value)]?.id)}
        value={prizeIndex}
      />
    );
  }, [activePrizeList, prizeIndex]);
  return {
    prizeId,
    setPrizeId,
    PrizeSelector,
  };
}
