import { Fragment } from 'react';
import { Text, View } from '@tarojs/components';
import { StatusWrapper, WhiteSpace } from '@ui/components';
import { Layout } from '@ui/container';
import { ConfigItem } from './components';
import styles from './index.module.scss';

interface ConfigListPanelProps {
  title: string;
  addButtonText?: string;
  list: Array<{ id: string } & Record<string, any>>;
  labelKey: string;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

export const ConfigListPanel = (props: ConfigListPanelProps) => {
  const { list, labelKey, title, addButtonText = '新增', onAdd, onEdit, onDelete } = props;

  return (
    <StatusWrapper count={list.length} size='fill'>
      <Layout type='card'>
        <View className={styles.header}>
          <Text>{title}</Text>
          <View className={styles.action} onClick={onAdd}>
            {addButtonText}
          </View>
        </View>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              {index !== 0 ? <WhiteSpace size='medium' /> : null}
              <ConfigItem
                id={item.id}
                label={item[labelKey] as string}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Fragment>
          );
        })}
      </Layout>
    </StatusWrapper>
  );
};
