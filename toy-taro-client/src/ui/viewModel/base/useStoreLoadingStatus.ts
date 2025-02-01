import { useEffect, useState } from 'react';
import { sdk, STORE_NAME } from '@core';

export function useStoreLoadingStatus(storeName: STORE_NAME) {
  const [loading, setLoading] = useState(() => sdk.storeManager.getLoadingStatus(storeName));

  useEffect(() => {
    const storeManager = sdk.storeManager;
    const updateLoading = () => setLoading(storeManager.getLoadingStatus(storeName));
    updateLoading();
    storeManager.subscribeLoading(storeName, updateLoading);
    return () => storeManager.unsubscribeLoading(storeName, updateLoading);
  }, [storeName]);

  return loading;
}
