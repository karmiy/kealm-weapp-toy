import { Fragment, useCallback, useState } from 'react';
import { View } from '@tarojs/components';
import { FloatLayout } from '@ui/components';
import { ConfigListPanel } from '@ui/container';
import { CategoryForm } from './components';
import styles from './index.module.scss';

const CATEGORY_LIST = [
  { id: '1', name: '卡牌' },
  { id: '2', name: '美乐蒂' },
  { id: '3', name: '玩偶' },
  { id: '4', name: '赛车' },
  { id: '5', name: '益智游戏' },
  { id: '6', name: '泡泡玛特' },
  { id: '7', name: '贴纸' },
  { id: '8', name: '安静书' },
  { id: '9', name: '文具' },
];

export default function () {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string>();

  const handleEdit = useCallback((id: string) => {
    setEditId(id);
    setShowEditModal(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditId(undefined);
    setShowEditModal(true);
  }, []);

  return (
    <Fragment>
      <ConfigListPanel
        title='商品分类'
        addButtonText='新增分类'
        list={CATEGORY_LIST}
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
            name={CATEGORY_LIST.find(item => item.id === editId)?.name}
            afterSave={() => setShowEditModal(false)}
          />
        </View>
      </FloatLayout>
    </Fragment>
  );
}
