import { useEffect, useState } from 'react';
import { sdk, STORE_NAME } from '@core';

export function useStoreList<T extends STORE_NAME>(storeName: T) {
  const [models, setModels] = useState(() => {
    return sdk.storeManager.getSortList(storeName);
  });

  useEffect(() => {
    const storeManager = sdk.storeManager;
    const updateModels = () => {
      setModels(sdk.storeManager.getSortList(storeName));
    };
    updateModels();
    storeManager.subscribe(storeName, updateModels);
    return () => storeManager.unsubscribe(storeName, updateModels);
  }, [storeName]);

  return models;
}
