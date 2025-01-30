import { Fragment, useCallback, useState } from 'react';
import { View } from '@tarojs/components';
import { FloatLayout } from '@ui/components';
import { ConfigListPanel } from '@ui/container';
import { CategoryForm } from './components';
import styles from './index.module.scss';

const CATEGORY_LIST = [
  { id: '1', name: '学习' },
  { id: '2', name: '运动' },
  { id: '3', name: '生活' },
  { id: '4', name: '兴趣' },
  { id: '5', name: '工作' },
  { id: '6', name: '健康' },
  { id: '7', name: '社交' },
  { id: '8', name: '环保' },
  { id: '9', name: '志愿服务' },
  { id: '10', name: '技能提升' },
  { id: '11', name: '旅行' },
  { id: '12', name: '财务' },
  { id: '13', name: '创造' },
  { id: '14', name: '休息' },
  { id: '15', name: '自我提升' },
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
        title='任务分类'
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
