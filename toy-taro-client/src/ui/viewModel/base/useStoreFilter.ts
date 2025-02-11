import { useCallback, useEffect, useState } from 'react';
import { sleep } from '@shared/utils/utils';
import { GetModel, sdk, STORE_NAME } from '@core';

interface Props<T extends STORE_NAME> {
  storeName: T;
  filterFunc: (model: GetModel<T>) => boolean; // 需要 useCallback 包装，引用变量会重新 search
  loadingWhenFilterChange?: boolean;
  loadingMinDuration?: number;
}

export function useStoreFilter<T extends STORE_NAME>(props: Props<T>) {
  const {
    storeName,
    filterFunc,
    loadingWhenFilterChange = true,
    loadingMinDuration = 1000,
  } = props;
  const [loading, setLoading] = useState(loadingWhenFilterChange);
  const [models, setModels] = useState<GetModel<T>[]>([]);

  const getFilterList = useCallback(() => {
    const storeManager = sdk.storeManager;
    const list = storeManager.getSortList(storeName);
    return list.filter(item => filterFunc(item as GetModel<T>)) as GetModel<T>[];
  }, [filterFunc, storeName]);

  useEffect(() => {
    const storeManager = sdk.storeManager;
    const handleChange = () => {
      setModels(getFilterList());
    };
    const handleChangeWithLoading = async () => {
      setLoading(true);
      await sleep(loadingMinDuration);
      const list = getFilterList();
      setModels(list);
      setLoading(false);
    };
    loadingWhenFilterChange ? handleChangeWithLoading() : handleChange();
    storeManager.subscribe(storeName, handleChange);

    return () => storeManager.unsubscribe(storeName, handleChange);
  }, [storeName, getFilterList, loadingMinDuration, loadingWhenFilterChange]);

  return {
    models,
    loading,
  };
}
