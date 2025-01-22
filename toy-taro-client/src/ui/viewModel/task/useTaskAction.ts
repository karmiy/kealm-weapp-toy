import { useCallback, useState } from 'react';
import { sdk } from '@core';

export function useTaskAction() {
  const [isSubmitApproving, setIsSubmitApproving] = useState(false);

  const submitApprovalRequest = useCallback(
    async (
      id: string,
      callback?: {
        success?: () => void;
        fallback?: () => void;
      },
    ) => {
      const { success, fallback } = callback ?? {};
      setIsSubmitApproving(true);
      try {
        await sdk.modules.task.submitApprovalRequest(id);
        success?.();
      } catch {
        fallback?.();
      }
      setIsSubmitApproving(false);
    },
    [],
  );

  return {
    submitApprovalRequest,
    isSubmitApproving,
  };
}
