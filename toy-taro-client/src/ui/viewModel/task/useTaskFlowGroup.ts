import { useEffect, useState } from 'react';
import { STORE_NAME } from '@core';
import { TaskFlowGroupController } from '@ui/controller';
import { useStoreById } from '../base';

interface Props {
  taskId: string;
}

export function useTaskFlowGroup(props: Props) {
  const { taskId } = props;

  const [taskFlowIds, setTaskFlowIds] = useState<string[]>(() => {
    return TaskFlowGroupController.getInstance().getIds(taskId) ?? [];
  });

  const taskFlow = useStoreById(STORE_NAME.TASK_FLOW, taskFlowIds[0]);

  useEffect(() => {
    const controller = TaskFlowGroupController.getInstance();
    const handleChange = () => setTaskFlowIds(controller.getIds(taskId));
    handleChange();
    controller.onGroupListChange(taskId, handleChange);
    return () => controller.offGroupListChange(taskId, handleChange);
  }, [taskId]);

  return {
    taskFlow,
  };
}
