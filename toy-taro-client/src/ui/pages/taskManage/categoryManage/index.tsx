import { Fragment, useCallback, useState } from 'react';
import { View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { FloatLayout } from '@ui/components';
import { ConfigListPanel } from '@ui/container';
import { useStoreList } from '@ui/viewModel';
import { CategoryForm } from './components';
import styles from './index.module.scss';

export default function () {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string>();
  const taskCategoryList = useStoreList(STORE_NAME.TASK_CATEGORY);
  const handleEdit = useCallback((id: string) => {
    setEditId(id);
    setShowEditModal(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditId(undefined);
    setShowEditModal(true);
  }, []);

  const handleSave = useCallback(() => {
    setShowEditModal(false);
  }, []);

  return (
    <Fragment>
      <ConfigListPanel
        title='任务分类'
        addButtonText='新增分类'
        list={taskCategoryList}
        labelKey='name'
        onAdd={handleAdd}
        onEdit={handleEdit}
      />
      <FloatLayout
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
        }}
      >
        <View className={styles.editModalWrapper}>
          <CategoryForm
            key={editId}
            id={editId}
            // name={taskCategoryList.find(item => item.id === editId)?.name}
            afterSave={handleSave}
          />
        </View>
      </FloatLayout>
    </Fragment>
  );
}
