import { useMemo, useState } from 'react';
import { PickerSelector } from '@ui/components';
import { ActivePrize, usePrizeList } from './usePrizeList';

interface Props {
  defaultValue?: string;
  includeNone?: boolean;
  includeLuckyDraw?: boolean;
  isMatchFunc?: (prize: ActivePrize) => boolean;
  placeholder?: string;
}

export function usePrizeSelector(props: Props) {
  const {
    defaultValue,
    includeNone,
    includeLuckyDraw,
    isMatchFunc,
    placeholder = '请选择奖品',
  } = props;
  const { activePrizeList: activePrizes } = usePrizeList({ includeNone, includeLuckyDraw });
  const [prizeId, setPrizeId] = useState(defaultValue);
  const activePrizeList = useMemo(() => {
    if (!isMatchFunc) {
      return activePrizes;
    }
    return activePrizes.filter(isMatchFunc);
  }, [activePrizes, isMatchFunc]);

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
        placeholder={placeholder}
        type='select'
        mode='selector'
        range={activePrizeList}
        rangeKey='detailDesc'
        onChange={e => setPrizeId(activePrizeList[Number(e.detail.value)]?.id)}
        value={prizeIndex}
      />
    );
  }, [activePrizeList, prizeIndex, placeholder]);
  return {
    prizeId,
    setPrizeId,
    PrizeSelector,
  };
}
