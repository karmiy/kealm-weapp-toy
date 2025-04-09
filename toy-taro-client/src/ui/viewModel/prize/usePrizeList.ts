import { useMemo } from 'react';
import { PRIZE_TYPE, STORE_NAME } from '@core';
import { useStoreList } from '../base';
import { useCouponList } from '../coupon';
import { getPrizeDesc } from './utils';

interface Props {
  includeNone?: boolean;
  includeLuckyDraw?: boolean;
}

export interface ActivePrize {
  detailDesc: string;
  shortDesc: string;
  terseDesc: string;
  id: string;
  type: PRIZE_TYPE;
  points?: number;
  couponId?: string;
  drawCount?: number;
  sortValue: number;
  text?: string;
  createTime: number;
  lastModifiedTime: number;
}

export function usePrizeList(props?: Props) {
  const { includeNone = false, includeLuckyDraw = true } = props ?? {};
  const { couponDict } = useCouponList();
  const prizeModels = useStoreList(STORE_NAME.PRIZE);
  const prizeList = useMemo(() => {
    return prizeModels.filter(item => {
      const conditions: Array<() => boolean> = [];
      if (!includeNone) {
        conditions.push(() => item.type !== PRIZE_TYPE.NONE);
      }
      if (!includeLuckyDraw) {
        conditions.push(() => item.type !== PRIZE_TYPE.LUCKY_DRAW);
      }
      return conditions.every(c => c());
    });
  }, [prizeModels, includeNone, includeLuckyDraw]);

  const activePrizeList = useMemo(() => {
    return prizeList.map(item => {
      const coupon = item.couponId ? couponDict.get(item.couponId) : undefined;
      return {
        ...item,
        detailDesc: getPrizeDesc({
          prize: item,
          coupon,
          descLevel: 'detail',
        }),
        shortDesc: getPrizeDesc({
          prize: item,
          coupon,
          descLevel: 'short',
        }),
        terseDesc: getPrizeDesc({
          prize: item,
          coupon,
          descLevel: 'terse',
        }),
      };
    });
  }, [couponDict, prizeList]);

  const prizeDict = useMemo(() => {
    const dict = new Map<string, (typeof activePrizeList)[number]>();
    activePrizeList.forEach(item => {
      dict.set(item.id, item);
    });
    return dict;
  }, [activePrizeList]);

  return {
    activePrizeList,
    prizeDict,
  };
}
