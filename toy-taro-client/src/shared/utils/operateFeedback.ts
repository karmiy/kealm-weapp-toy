import { showModal as TaroShowModal, showToast as TaroShowToast } from '@tarojs/taro';
import { COLOR_VARIABLES } from './constants';

export const showModal = async (options: {
  title?: string;
  content: string;
  cancelText?: string;
  confirmText?: string;
}) => {
  const { title = '提示', content, cancelText = '取消', confirmText = '确定' } = options;
  return new Promise((resolve, reject) => {
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

export const showToast = (options: {
  title: string;
  icon?: 'success' | 'error' | 'loading' | 'none';
  duration?: number;
}) => {
  const { title, icon = 'none', duration = 2000 } = options;
  TaroShowToast({
    title,
    icon,
    duration,
  });
};
