import { createContext } from 'react';

interface TaskContextProp {
  onSubmitApproval: (success?: boolean) => void;
}

const callback = () => {};

export const TaskContext = createContext<TaskContextProp>({
  onSubmitApproval: callback,
});
