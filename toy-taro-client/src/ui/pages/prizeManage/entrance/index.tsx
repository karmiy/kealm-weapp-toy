import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { STORE_NAME } from '@core';
import { FloatLayout } from '@ui/components';
import { ConfigListPanel } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import { useStoreList } from '@ui/viewModel';
import { PrizeEditForm, PrizeItem } from './components';
import styles from './index.module.scss';

export default function () {
  const { handleRefresh, refresherTriggered } = useSyncOnPageShow();
  const [isSorting, setIsSorting] = useState(false);
  const scrollViewProps = useMemo(() => {
    if (isSorting) {
      return;
    }
    return {
      refresherEnabled: true,
      refresherTriggered,
      refresherBackground: COLOR_VARIABLES.FILL_BODY,
      onRefresherRefresh: handleRefresh,
    };
  }, [handleRefresh, refresherTriggered, isSorting]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string>();

  const prizeList = useStoreList(STORE_NAME.PRIZE);
  const [list, setList] = useState(prizeList);
  useEffect(() => {
    setList(prizeList);
  }, [prizeList]);
  const handleSortStart = useCallback(() => {
    setIsSorting(true);
  }, []);
  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const newArray = [...list];
      const [removedItem] = newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, removedItem);
      setList(newArray);
      setIsSorting(false);
    },
    [list],
  );

  // const { handleDeleteCategory } = useTaskAction();
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

  const handleDelete = useCallback(async (id: string) => {
    // await handleDeleteCategory({
    //   id,
    // });
  }, []);

  const renderContent = useCallback(
    ({ index }: { index: number }) => {
      const prize = list[index];
      return <PrizeItem id={prize.id} />;
    },
    [list],
  );

  return (
    <Fragment>
      <ConfigListPanel
        title='奖品管理'
        addButtonText='新增奖品'
        list={list}
        renderContent={renderContent}
        scrollViewProps={scrollViewProps}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortable
        onSortStart={handleSortStart}
        onSortEnd={handleSortEnd}
      />
      <FloatLayout
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
        }}
      >
        <View className={styles.editModalWrapper}>
          <PrizeEditForm key={editId} id={editId} afterSave={handleSave} />
        </View>
      </FloatLayout>
    </Fragment>
  );
}
