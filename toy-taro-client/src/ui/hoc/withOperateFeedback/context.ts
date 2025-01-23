import { createContext, useContext } from 'react';

export interface ToastParams {
  text: string;
}

export interface ConfirmDialogParams {
  title?: string;
  content: string;
  cancelText?: string;
  confirmText?: string;
}

interface ContextProps {
  openToast: (params: ToastParams) => void;
  openConfirmDialog: (params: ConfirmDialogParams) => Promise<boolean>;
}

export const Context = createContext<ContextProps>({
  openToast: () => {},
  openConfirmDialog: () => Promise.resolve(true),
});

export function useOperateFeedback() {
  const { openToast, openConfirmDialog } = useContext(Context);
  return { openToast, openConfirmDialog };
}
