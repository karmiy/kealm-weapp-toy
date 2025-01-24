import { useEffect, useState } from 'react';
import { sdk, SingleStoreNames, STORE_NAME } from '@core';
import { useForceUpdate } from '@ui/hooks';

export function useSingleStore<T extends SingleStoreNames>(storeName: T) {
  const [model, setModel] = useState(sdk.storeManager.get(storeName));
  const update = useForceUpdate();

  useEffect(() => {
    const storeManager = sdk.storeManager;
    const updateStore = () => {
      setModel(storeManager.get(storeName));
      update();
    };
    updateStore();
    storeManager.subscribe(storeName, updateStore);
    return () => storeManager.unsubscribe(STORE_NAME.CHECK_IN, updateStore);
  }, [storeName, update]);

  return model;
}
