import { useEffect, useState } from 'react';
import { sdk, STORE_NAME, TASK_TYPE, TaskCategoryModel } from '@core';
import { TaskGroupController } from '@ui/controller';
import { useConsistentFunc } from '@ui/hooks';
import { useStoreList } from '../base';

interface Props {
  type: TASK_TYPE;
}

export function useTaskCategoryList(props: Props) {
  const { type } = props;
  const allCategoryList = useStoreList(STORE_NAME.TASK_CATEGORY);
  const [categoryList, setCategoryList] = useState<TaskCategoryModel[]>([]);
  const updateCategoryList = useConsistentFunc(() => {
    const list = allCategoryList.filter(item => {
      const identifier = TaskGroupController.getInstance().generateGroupByIdentifier(type, item.id);
      return TaskGroupController.getInstance().getIds(identifier).length > 0;
    });
    setCategoryList(list);
  });

  useEffect(() => {
    const storeManager = sdk.storeManager;
    updateCategoryList();
    storeManager.subscribe(STORE_NAME.TASK, updateCategoryList);
    storeManager.subscribe(STORE_NAME.TASK_CATEGORY, updateCategoryList);
    return () => {
      storeManager.unsubscribe(STORE_NAME.TASK, updateCategoryList);
      storeManager.unsubscribe(STORE_NAME.TASK_CATEGORY, updateCategoryList);
    };
  }, [updateCategoryList]);

  return {
    categoryList,
  };
}
