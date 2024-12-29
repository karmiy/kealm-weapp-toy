import { PropsWithChildren } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { OsActionsheet as OsActionSheet } from 'ossaui';
import { Icon } from '../icon';
import styles from './index.module.scss';

interface ActionSheetProps extends PropsWithChildren {
  visible?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  maxHeight?: number;
}

const ActionSheet = (props: ActionSheetProps) => {
  const { visible = false, onClose, title, maxHeight, children } = props;

  return (
    <OsActionSheet className={styles.wrapper} isShow={visible} onClose={onClose}>
      <View className={styles.title}>
        {title}
        <View className={styles.close} onClick={onClose}>
          <Icon size={16} name='close' />
        </View>
      </View>
      <ScrollView scrollY style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}>
        {children}
      </ScrollView>
    </OsActionSheet>
  );
};

export { ActionSheet };
