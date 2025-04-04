import { useEffect, useMemo, useState } from 'react';
import { isThisWeek, isToday } from 'date-fns';
import { sdk, STORE_NAME, TASK_TYPE } from '@core';
import { TaskFlowGroupController } from '@ui/controller';
import { useStoreById } from '../base';

interface Props {
  taskId: string;
}

export function useTaskFlowGroup(props: Props) {
  const { taskId } = props;
  const task = useStoreById(STORE_NAME.TASK, taskId);
  const taskType = useMemo(() => task?.type, [task?.type]);

  const [taskFlowIds, setTaskFlowIds] = useState<string[]>(() => {
    return TaskFlowGroupController.getInstance().getIds(taskId) ?? [];
  });

  const availableTaskFlowId = useMemo(() => {
    if (!taskType) {
      return;
    }
    const storeManager = sdk.storeManager;

    // 只要 taskFlow 里有一个创建时间是今天的就算
    if (taskType === TASK_TYPE.DAILY) {
      const flowId = taskFlowIds.find(id => {
        const taskFlow = storeManager.getById(STORE_NAME.TASK_FLOW, id);
        if (!taskFlow) {
          return false;
        }
        return isToday(taskFlow.createTime);
      });
      return flowId;
    }
    // 只要 taskFlow 里有一个创建时间是这周的就算
    if (taskType === TASK_TYPE.WEEKLY) {
      const flowId = taskFlowIds.find(id => {
        const taskFlow = storeManager.getById(STORE_NAME.TASK_FLOW, id);
        if (!taskFlow) {
          return false;
        }
        return isThisWeek(taskFlow.createTime, { weekStartsOn: 1 });
      });
      return flowId;
    }

    if (taskType === TASK_TYPE.PHASE || taskType === TASK_TYPE.INSTANT) {
      return taskFlowIds[0];
    }
  }, [taskFlowIds, taskType]);

  const taskFlow = useStoreById(STORE_NAME.TASK_FLOW, availableTaskFlowId);

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
