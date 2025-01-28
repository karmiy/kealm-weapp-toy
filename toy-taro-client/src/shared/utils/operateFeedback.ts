import { showModal as TaroShowModal, showToast as TaroShowToast } from '@tarojs/taro';
import { COLOR_VARIABLES } from './constants';
import { sleep } from './utils';

export const showModal = async (options: {
  title?: string;
  content: string;
  cancelText?: string;
  confirmText?: string;
}) => {
  const { title = '提示', content, cancelText = '取消', confirmText = '确定' } = options;
  return new Promise<boolean>((resolve, reject) => {
    TaroShowModal({
      title,
      content,
      cancelText,
      confirmText,
      confirmColor: COLOR_VARIABLES.COLOR_RED,
      success: modalRes => {
        resolve(modalRes.confirm);
      },
      fail: error => {
        reject(error);
      },
    });
  });
};

export const showToast = async (options: {
  title: string;
  icon?: 'success' | 'error' | 'loading' | 'none';
  duration?: number;
  awaitClose?: boolean;
}) => {
  return new Promise<void>((resolve, reject) => {
    const { title, icon = 'none', duration = 1500, awaitClose = false } = options;
    TaroShowToast({
      title,
      icon,
      duration,
      success: async () => {
        if (!awaitClose) {
          resolve();
          return;
        }
        await sleep(duration);
        resolve();
      },
      fail: error => {
        reject(error);
      },
    });
  });
};
