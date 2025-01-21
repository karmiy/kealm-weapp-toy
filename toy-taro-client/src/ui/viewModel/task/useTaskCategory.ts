import { useEffect, useMemo, useState } from 'react';
import { TASK_TYPE } from '@core';
import { TaskCategoryController } from '@ui/controller';

interface Props {
  type: TASK_TYPE;
  categoryId: string;
}

export function useTaskCategory(props: Props) {
  const { type, categoryId } = props;
  const categoryIdentifier = useMemo(
    () => TaskCategoryController.getInstance().generateCategoryIdentifier(type, categoryId),
    [type, categoryId],
  );

  const [taskIdsForCategory, setTaskListForCategory] = useState<string[]>(() => {
    return TaskCategoryController.getInstance().getIds(categoryIdentifier) ?? [];
  });

  useEffect(() => {
    const controller = TaskCategoryController.getInstance();
    const handleChange = () => setTaskListForCategory(controller.getIds(categoryIdentifier));
    handleChange();
    controller.onCategoryListChange(categoryIdentifier, handleChange);
    return () => controller.offCategoryListChange(categoryIdentifier, handleChange);
  }, [categoryIdentifier]);

  return {
    taskIds: taskIdsForCategory,
  };
}
