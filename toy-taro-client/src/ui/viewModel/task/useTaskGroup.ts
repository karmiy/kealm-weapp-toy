import { useEffect, useMemo, useState } from 'react';
import { TASK_TYPE } from '@core';
import { TaskGroupController } from '@ui/controller';

interface Props {
  type: TASK_TYPE;
  categoryId: string;
}

export function useTaskGroup(props: Props) {
  const { type, categoryId } = props;
  const groupByIdentifier = useMemo(
    () => TaskGroupController.getInstance().generateGroupByIdentifier(type, categoryId),
    [type, categoryId],
  );

  const [taskIdsForType, setTaskIdsForType] = useState<string[]>(() => {
    return TaskGroupController.getInstance().getIds(groupByIdentifier) ?? [];
  });

  useEffect(() => {
    const controller = TaskGroupController.getInstance();
    const handleChange = () => setTaskIdsForType(controller.getIds(groupByIdentifier));
    handleChange();
    controller.onGroupListChange(groupByIdentifier, handleChange);
    return () => controller.offGroupListChange(groupByIdentifier, handleChange);
  }, [groupByIdentifier]);

  return {
    taskIds: taskIdsForType,
  };
}
