import { useEffect, useState } from 'react';
import { sdk, STORE_NAME } from '@core';

export function useStoreIds(storeName: STORE_NAME) {
  const [ids, setIds] = useState<string[]>(() => sdk.storeManager.getSortIds(storeName));

  useEffect(() => {
    const storeManager = sdk.storeManager;
    const updateIds = () => {
      setIds([...storeManager.getSortIds(storeName)]);
    };
    updateIds();
    storeManager.subscribeIdList(storeName, updateIds);
    return () => storeManager.unsubscribeIdList(storeName, updateIds);
  }, [storeName]);

  return ids;
}
