import { Fragment } from 'react';
import { ScrollViewProps, Text, View } from '@tarojs/components';
import { StatusWrapper, WhiteSpace } from '@ui/components';
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
  } = props;

  return (
    <Layout type='card' scrollViewProps={scrollViewProps}>
      <View className={styles.header}>
        <Text>{title}</Text>
        <View className={styles.action} onClick={onAdd}>
          {addButtonText}
        </View>
      </View>

      <StatusWrapper count={list.length} size='flex'>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              {index !== 0 ? <WhiteSpace size='medium' /> : null}
              <ConfigItem
                id={item.id}
                renderContent={({ id }) => renderContent({ id, index })}
                onEdit={onEdit}
                onDelete={onDelete}
                editable={editable}
                deletable={deletable}
              />
            </Fragment>
          );
        })}
      </StatusWrapper>
    </Layout>
  );
};
