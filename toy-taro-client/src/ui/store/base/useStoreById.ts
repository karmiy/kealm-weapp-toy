import { useEffect, useState } from 'react';
import { sdk, STORE_NAME } from '@core';
import { useForceUpdate } from '@/ui/hooks';

export function useStoreById<T extends STORE_NAME>(storeName: T, id: string) {
  const [model, setModel] = useState(sdk.storeManager.getById(storeName, id));
  const update = useForceUpdate();

  useEffect(() => {
    const storeManager = sdk.storeManager;
    const updateIds = () => {
      setModel(storeManager.getById(storeName, id));
      update();
    };
    storeManager.subscribeById(storeName, id, updateIds);
    return () => storeManager.unsubscribeById(storeName, id, updateIds);
  }, [storeName, id, update]);

  return model;
}
