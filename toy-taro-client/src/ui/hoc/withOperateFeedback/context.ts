import { createContext, useContext } from 'react';

export interface FeedbackParams {
  mes: string;
}

interface ContextProps {
  openToast: (params: FeedbackParams) => void;
}

const callback = () => {};

export const Context = createContext<ContextProps>({
  openToast: callback,
});

export function useOperateFeedback() {
  const { openToast } = useContext(Context);
  return { openToast };
}
