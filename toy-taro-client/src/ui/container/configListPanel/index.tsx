import { Fragment } from 'react';
import { ScrollViewProps, Text, View } from '@tarojs/components';
import { SortableItem, SortableList, StatusWrapper, WhiteSpace } from '@ui/components';
import { Layout } from '@ui/container';
import { ConfigItem } from './components';
import styles from './index.module.scss';

interface ConfigListPanelProps {
  title: string;
  addButtonText?: string;
  list: Array<{ id: string } & Record<string, any>>;
  renderContent: (params: { id: string; index: number }) => React.ReactNode;
  onAdd?: () => void;
  editable?: boolean;
  deletable?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
  scrollViewProps?: ScrollViewProps;
  sortable?: boolean;
  onSortStart?: () => void;
  onSortEnd?: (params: { oldIndex: number; newIndex: number }) => void;
}

export const ConfigListPanel = (props: ConfigListPanelProps) => {
  const {
    list,
    renderContent,
    title,
    addButtonText = '新增',
    scrollViewProps,
    onAdd,
    editable = true,
    deletable = true,
    onEdit,
    onDelete,
    sortable = false,
    onSortStart,
    onSortEnd,
  } = props;
  const listSize = list.length;

  return (
    <Layout type='card' scrollViewProps={scrollViewProps}>
      <View className={styles.header}>
        <Text>{title}</Text>
        <View className={styles.action} onClick={onAdd}>
          {addButtonText}
        </View>
      </View>

      <StatusWrapper count={list.length} size='flex'>
        <SortableList disabled={!sortable} onSortStart={onSortStart} onSortEnd={onSortEnd}>
          {list.map((item, index) => {
            return (
              <SortableItem key={item.id} index={index}>
                <ConfigItem
                  id={item.id}
                  renderContent={({ id }) => renderContent({ id, index })}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  editable={editable}
                  deletable={deletable}
                />
                {index !== listSize - 1 ? <WhiteSpace size='medium' /> : null}
              </SortableItem>
            );
          })}
        </SortableList>
      </StatusWrapper>
    </Layout>
  );
};
