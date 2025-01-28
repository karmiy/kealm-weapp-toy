import { useCallback } from 'react';
import { ITouchEvent, Text, View } from '@tarojs/components';
import { showModal } from '@shared/utils/operateFeedback';
import { Icon, WhiteSpace } from '@ui/components';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import styles from './index.module.scss';

interface ItemProps {
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const Item = (props: ItemProps) => {
  const { onClick, onEdit } = props;
  const handleEdit = useCallback(
    (e: ITouchEvent) => {
      e.stopPropagation();
      onEdit?.('123');
    },
    [onEdit],
  );
  const handleDelete = useCallback(async (e: ITouchEvent) => {
    e.stopPropagation();
    const feedback = await showModal({
      content: '确定要删除吗？',
    });
  }, []);

  return (
    <View className={styles.itemWrapper} onClick={onClick}>
      <Text>数字电子</Text>
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
