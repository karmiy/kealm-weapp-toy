import { useCallback, useState } from 'react';
import { ITouchEvent, Text, View } from '@tarojs/components';
import { Icon } from '@ui/components';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import styles from './index.module.scss';

interface ConfigItemProps {
  id: string;
  renderContent: (params: { id: string }) => React.ReactNode;
  editable?: boolean;
  deletable?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

export const ConfigItem = (props: ConfigItemProps) => {
  const { id, renderContent, editable = true, deletable = true, onEdit, onDelete } = props;
  const [isActionLoading, setIsActionLoading] = useState(false);
  const handleEdit = useCallback(
    (e: ITouchEvent) => {
      e.stopPropagation();
      onEdit?.(id);
    },
    [onEdit, id],
  );
  const handleDelete = useCallback(
    async (e: ITouchEvent) => {
      e.stopPropagation();
      try {
        if (isActionLoading) {
          return;
        }
        setIsActionLoading(true);
        await onDelete?.(id);
      } finally {
        setIsActionLoading(false);
      }
    },
    [onDelete, id, isActionLoading],
  );

  return (
    <View className={styles.configItemWrapper}>
      <View className={styles.contentWrapper}>{renderContent({ id })}</View>
      <View className={styles.actionWrapper}>
        {editable && (
          <View className={styles.actionItem} onClick={handleEdit}>
            <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} />
          </View>
        )}
        {deletable && (
          <View className={styles.actionItem} onClick={handleDelete}>
            <Icon name='delete' color={COLOR_VARIABLES.COLOR_RED} />
          </View>
        )}
      </View>
    </View>
  );
};
