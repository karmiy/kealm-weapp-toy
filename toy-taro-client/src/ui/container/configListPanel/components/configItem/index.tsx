import { useCallback, useState } from 'react';
import { ITouchEvent, Text, View } from '@tarojs/components';
import { showModal } from '@shared/utils/operateFeedback';
import { Icon, WhiteSpace } from '@ui/components';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import styles from './index.module.scss';

interface ConfigItemProps {
  id: string;
  label: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

export const ConfigItem = (props: ConfigItemProps) => {
  const { id, label, onEdit, onDelete } = props;
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
        const feedback = await showModal({
          content: '确定要删除吗？',
        });
        setIsActionLoading(true);
        feedback && (await onDelete?.(id));
      } finally {
        setIsActionLoading(false);
      }
    },
    [onDelete, id, isActionLoading],
  );

  return (
    <View className={styles.configItemWrapper}>
      <Text>{label}</Text>
      <View className={styles.actionWrapper}>
        <View onClick={handleEdit}>
          <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} />
        </View>
        <WhiteSpace isVertical={false} size='small' />
        <View onClick={handleDelete}>
          <Icon name='delete' color={COLOR_VARIABLES.TEXT_COLOR_BASE} />
        </View>
      </View>
    </View>
  );
};
