import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { AtModal } from 'taro-ui';
import type { AtModalProps } from 'taro-ui/types/modal';
import styles from './index.module.scss';

interface ModalProps extends PropsWithChildren<Omit<AtModalProps, 'isOpened'>> {
  visible?: boolean;
}

const Modal = (props: ModalProps) => {
  const { className, visible = false, children, ...rest } = props;

  return <AtModal className={clsx(styles.modalWrapper, className)} isOpened={visible} {...rest} />;
};

export { Modal };
