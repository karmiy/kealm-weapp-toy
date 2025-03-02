import { Fragment, useCallback, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { STORE_NAME } from '@core';
import { FloatLayout } from '@ui/components';
import { ConfigListPanel } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import { useStoreList, useTaskAction } from '@ui/viewModel';
import { CategoryForm } from './components';
import styles from './index.module.scss';

export default function () {
  const { handleRefresh, refresherTriggered } = useSyncOnPageShow();
  const scrollViewProps = useMemo(() => {
    return {
      refresherEnabled: true,
      refresherTriggered,
      refresherBackground: COLOR_VARIABLES.FILL_BODY,
      onRefresherRefresh: handleRefresh,
    };
  }, [handleRefresh, refresherTriggered]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string>();
  const taskCategoryList = useStoreList(STORE_NAME.TASK_CATEGORY);
  const { handleDeleteCategory } = useTaskAction();
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

  const handleDelete = useCallback(
    async (id: string) => {
      await handleDeleteCategory({
        id,
      });
    },
    [handleDeleteCategory],
  );

  const renderContent = useCallback(
    ({ index }: { index: number }) => {
      return taskCategoryList[index].name;
    },
    [taskCategoryList],
  );

  return (
    <Fragment>
      <ConfigListPanel
        title='任务分类'
        addButtonText='新增分类'
        list={taskCategoryList}
        renderContent={renderContent}
        scrollViewProps={scrollViewProps}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
