import { Fragment, useCallback, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { STORE_NAME } from '@core';
import { FloatLayout } from '@ui/components';
import { ConfigListPanel } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import { useProductAction, useStoreList } from '@ui/viewModel';
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
  const productCategoryList = useStoreList(STORE_NAME.PRODUCT_CATEGORY);
  const { handleDeleteCategory } = useProductAction();
  const handleEdit = useCallback((id: string) => {
    setEditId(id);
    setShowEditModal(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditId(undefined);
    setShowEditModal(true);
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
      return productCategoryList[index].name;
    },
    [productCategoryList],
  );

  return (
    <Fragment>
      <ConfigListPanel
        title='商品分类'
        addButtonText='新增分类'
        list={productCategoryList}
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
            // name={productCategoryList.find(item => item.id === editId)?.name}
            afterSave={() => setShowEditModal(false)}
          />
        </View>
      </FloatLayout>
    </Fragment>
  );
}
