import { useState } from 'react';
import { View } from '@tarojs/components';
import { sleep } from '@shared/utils/utils';
import { Button, Input } from '@ui/components';
import { FormItem } from '@ui/container';
import styles from './index.module.scss';

interface CategoryFormProps {
  id?: string;
  name?: string;
  afterSave?: () => void;
}

export const CategoryForm = (props: CategoryFormProps) => {
  const { id, name, afterSave } = props;
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(name);

  const handleSave = async () => {
    try {
      setIsActionLoading(true);
      await sleep(1000);
      afterSave?.();
    } finally {
      setIsActionLoading(false);
    }
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
        icon={isActionLoading ? 'loading' : undefined}
        disabled={!categoryName || isActionLoading}
        onClick={handleSave}
      >
        保存
      </Button>
    </View>
  );
};
