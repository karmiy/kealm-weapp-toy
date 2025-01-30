import { useEffect, useMemo, useState } from 'react';
import { STORE_NAME } from '@core';
import { TaskFlowCategoryController } from '@ui/controller';
import { useStoreById } from '../base';

interface Props {
  taskId: string;
}

export function useTaskFlowCategory(props: Props) {
  const { taskId } = props;

  const [taskFlowIds, setTaskFlowIds] = useState<string[]>(() => {
    return TaskFlowCategoryController.getInstance().getIds(taskId) ?? [];
  });

  const taskFlow = useStoreById(STORE_NAME.TASK_FLOW, taskFlowIds[0]);

  useEffect(() => {
    const controller = TaskFlowCategoryController.getInstance();
    const handleChange = () => setTaskFlowIds(controller.getIds(taskId));
    handleChange();
    controller.onCategoryListChange(taskId, handleChange);
    return () => controller.offCategoryListChange(taskId, handleChange);
  }, [taskId]);

  return {
    taskFlow,
  };
}
