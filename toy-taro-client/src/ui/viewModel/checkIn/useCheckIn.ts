import { useCallback, useEffect, useRef } from 'react';
import { showToast } from '@shared/utils/operateFeedback';
import { sdk, STORE_NAME } from '@core';
import { useSingleStore, useStoreLoadingStatus } from '../base';

export function useCheckIn() {
  const checkInInfo = useSingleStore(STORE_NAME.CHECK_IN);
  const loading = useStoreLoadingStatus(STORE_NAME.CHECK_IN);
  const isClaimingRef = useRef(false);
  const isCheckInPendingRef = useRef(false);

  useEffect(() => {
    sdk.modules.checkIn.syncCheckInInfo();
  }, []);

  const claimReward = useCallback(async (ruleId: string) => {
    try {
      if (isClaimingRef.current) {
        return;
      }
      isClaimingRef.current = true;
      await sdk.modules.checkIn.claimReward(ruleId);
      showToast({ title: '领取成功！' });
    } catch {
      showToast({ title: '领取失败！' });
    } finally {
      isClaimingRef.current = false;
    }
  }, []);

  const checkInToday = useCallback(async () => {
    try {
      if (isCheckInPendingRef.current) {
        return;
      }
      isCheckInPendingRef.current = true;
      await sdk.modules.checkIn.checkInToday();
      showToast({ title: '签到成功！' });
    } catch {
      showToast({ title: '签到失败！' });
    } finally {
      isCheckInPendingRef.current = false;
    }
  }, []);

  return {
    checkInInfo,
    loading,
    claimReward,
    checkInToday,
  };
}
