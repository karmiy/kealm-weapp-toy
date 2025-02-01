import { useState } from 'react';
import { View } from '@tarojs/components';
import { sleep } from '@shared/utils/utils';
import { STORE_NAME } from '@core';
import { Button, Input } from '@ui/components';
import { FormItem } from '@ui/container';
import { useProductAction, useStoreById } from '@ui/viewModel';
import styles from './index.module.scss';

interface CategoryFormProps {
  id?: string;
  afterSave?: () => void;
}

export const CategoryForm = (props: CategoryFormProps) => {
  const { id, afterSave } = props;
  const productCategory = useStoreById(STORE_NAME.PRODUCT_CATEGORY, id);
  const { isActionLoading, handleUpdateCategory } = useProductAction();
  const [categoryName, setCategoryName] = useState(productCategory?.name ?? '');

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
