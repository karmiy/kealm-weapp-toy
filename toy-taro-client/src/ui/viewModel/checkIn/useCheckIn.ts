import { useCallback, useEffect, useRef } from 'react';
import { sdk, STORE_NAME } from '@core';
import { useOperateFeedback } from '@/ui/hoc';
import { useSingleStore, useStoreLoadingStatus } from '../base';

export function useCheckIn() {
  const checkInInfo = useSingleStore(STORE_NAME.CHECK_IN);
  const loading = useStoreLoadingStatus(STORE_NAME.CHECK_IN);
  const { openToast } = useOperateFeedback();
  const isClaimingRef = useRef(false);
  const isCheckInPendingRef = useRef(false);

  useEffect(() => {
    sdk.modules.checkIn.syncCheckInInfo();
  }, []);

  const claimReward = useCallback(
    async (ruleId: string) => {
      try {
        if (isClaimingRef.current) {
          return;
        }
        isClaimingRef.current = true;
        await sdk.modules.checkIn.claimReward(ruleId);
        openToast({ text: '领取成功！' });
      } catch {
        openToast({ text: '领取失败！' });
      } finally {
        isClaimingRef.current = false;
      }
    },
    [openToast],
  );

  const checkInToday = useCallback(async () => {
    try {
      if (isCheckInPendingRef.current) {
        return;
      }
      isCheckInPendingRef.current = true;
      await sdk.modules.checkIn.checkInToday();
      openToast({ text: '签到成功！' });
    } catch {
      openToast({ text: '签到失败！' });
    } finally {
      isCheckInPendingRef.current = false;
    }
  }, [openToast]);

  return {
    checkInInfo,
    loading,
    claimReward,
    checkInToday,
  };
}
