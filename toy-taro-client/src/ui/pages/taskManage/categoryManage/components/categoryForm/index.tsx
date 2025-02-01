import { useState } from 'react';
import { View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { Button, Input } from '@ui/components';
import { FormItem } from '@ui/container';
import { useStoreById, useTaskAction } from '@ui/viewModel';
import styles from './index.module.scss';

interface CategoryFormProps {
  id?: string;
  afterSave?: () => void;
}

export const CategoryForm = (props: CategoryFormProps) => {
  const { id, afterSave } = props;
  const taskCategory = useStoreById(STORE_NAME.TASK_CATEGORY, id);
  const { isActionLoading, handleUpdateCategory } = useTaskAction();
  const [categoryName, setCategoryName] = useState(taskCategory?.name ?? '');

  const handleSave = async () => {
    await handleUpdateCategory({
      id,
      name: categoryName,
      onSuccess: afterSave,
    });
  };

  return (
    <View className={styles.categoryFormWrapper}>
      <FormItem title='分类名称'>
        <Input
          placeholder='请输入分类名称'
          value={categoryName}
          onInput={e => setCategoryName(e.detail.value)}
        />
      </FormItem>
      <Button
        size='large'
        width='100%'
        loading={isActionLoading}
        disabled={!categoryName || isActionLoading}
        onClick={handleSave}
      >
        保存
      </Button>
    </View>
  );
};
