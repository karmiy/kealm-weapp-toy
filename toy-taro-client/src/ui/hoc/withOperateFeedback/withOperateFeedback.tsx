import { ComponentType, useCallback, useState } from 'react';
import { Block } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { Modal } from '@ui/components';
import { ConfirmDialogParams, Context, ToastParams } from './context';

interface Config {
  enableToast?: boolean;
  enableConfirmDialog?: boolean;
}

interface ConfirmDialogProps extends ConfirmDialogParams {
  visible: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const DEFAULT_CONFIRM_DIALOG_PROPS = {
  visible: false,
  title: '提示',
  cancelText: '取消',
  confirmText: '确定',
};

export function withOperateFeedback<T extends object>(
  WrappedComponent: ComponentType<T>,
  Config?: Config,
) {
  const { enableToast = false, enableConfirmDialog = false } = Config ?? {};
  return (props: T) => {
    const [toastProps, setToastProps] = useState({ isOpened: false, text: '' });
    const openToast = useCallback((params: ToastParams) => {
      setToastProps({
        ...params,
        isOpened: true,
      });
    }, []);

    const [confirmDialogProps, setConfirmDialogProps] = useState<ConfirmDialogProps>({
      ...DEFAULT_CONFIRM_DIALOG_PROPS,
      content: '',
    });
    const onCloseDialog = useCallback(() => {
      setConfirmDialogProps(prev => ({ ...prev, visible: false }));
    }, []);
    const openConfirmDialog = useCallback(
      async (params: ConfirmDialogParams) => {
        return new Promise<boolean>(resolve => {
          const handleFeedback = (value: boolean) => {
            onCloseDialog();
            resolve(value);
          };
          setConfirmDialogProps({
            ...DEFAULT_CONFIRM_DIALOG_PROPS,
            ...params,
            onClose: () => handleFeedback(false),
            onCancel: () => handleFeedback(false),
            onConfirm: () => handleFeedback(true),
            visible: true,
          });
        });
      },
      [onCloseDialog],
    );

    return (
      <Context.Provider value={{ openToast, openConfirmDialog }}>
        <WrappedComponent {...props} />
        {/* https://juejin.cn/post/7299736066423848994 */}
        {/* scrollView 同级节点有更新会导致 scroll 位置回到 0 */}
        <Block>
          {enableToast && (
            <AtToast
              {...toastProps}
              onClose={() => setToastProps(prev => ({ ...prev, isOpened: false }))}
            />
          )}
          {enableConfirmDialog && <Modal {...confirmDialogProps} />}
        </Block>
      </Context.Provider>
    );
  };
}
