import { STORE_NAME } from '@core';
import { useSingleStore } from '../base';

export function useUserInfo() {
  const user = useSingleStore(STORE_NAME.USER);

  const isAdmin = !!user?.isAdmin;

  return {
    isAdmin,
    score: user?.availableScore ?? 0,
  };
}
