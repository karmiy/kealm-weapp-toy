import { useEffect, useState } from 'react';
import { sdk, STORE_NAME } from '@core';

export function useStoreByIds<T extends STORE_NAME>(storeName: T, ids: string[]) {
  const [models, setModels] = useState(
    ids.map(id => sdk.storeManager.getById(storeName, id)!).filter(Boolean),
  );

  useEffect(() => {
    const storeManager = sdk.storeManager;
    const updateIds = () => {
      const items = ids.map(id => sdk.storeManager.getById(storeName, id)!).filter(Boolean);
      setModels(items);
    };
    updateIds();
    ids.forEach(id => storeManager.subscribeById(storeName, id, updateIds));
    return () => ids.forEach(id => storeManager.unsubscribeById(storeName, id, updateIds));
  }, [storeName, ids]);

  return models;
}
