import { Fragment, useCallback, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { navigateBack } from '@tarojs/taro';
import { Button, FloatLayout, Input, WhiteSpace } from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { CategoryItem } from './components';
import styles from './index.module.scss';

export default function () {
  const categoryList = ['贴纸', '拼图', '益智', '咕卡'];
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleCategorySelect = useCallback((id: string) => {
    navigateBack();
  }, []);

  const handleEditCategory = useCallback((id: string) => {
    setShowEditCategory(true);
  }, []);

  return (
    <Layout type='card'>
      <View className={styles.header}>
        <Text>商品分类</Text>
        <View className={styles.action} onClick={() => setShowEditCategory(true)}>
          新增分类
        </View>
      </View>
      {[...Array(20).keys()].map(index => {
        return (
          <Fragment key={index}>
            {index !== 0 ? <WhiteSpace size='medium' /> : null}
            <CategoryItem onClick={handleCategorySelect} onEdit={handleEditCategory} />
          </Fragment>
        );
      })}
      <FloatLayout
        visible={showEditCategory}
        onClose={() => {
          setShowEditCategory(false);
        }}
      >
        <View className={styles.editCategoryWrapper}>
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
          >
            保存
          </Button>
        </View>
      </FloatLayout>
    </Layout>
  );
}
