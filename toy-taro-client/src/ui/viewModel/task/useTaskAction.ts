import { useCallback, useState } from 'react';
import { sdk } from '@core';

export function useTaskAction() {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const submitApprovalRequest = useCallback(
    async (
      id: string,
      callback?: {
        success?: () => void;
        fallback?: () => void;
      },
    ) => {
      const { success, fallback } = callback ?? {};
      setIsActionLoading(true);
      try {
        await sdk.modules.task.submitApprovalRequest(id);
        success?.();
      } catch {
        fallback?.();
      }
      setIsActionLoading(false);
    },
    [],
  );

  return {
    submitApprovalRequest,
    isActionLoading,
  };
}
