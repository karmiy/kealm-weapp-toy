import { Fragment, useCallback, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { navigateBack } from '@tarojs/taro';
import { Button, FloatLayout, Input, SafeAreaBar, WhiteSpace } from '@ui/components';
import { FormItem } from '@ui/container';
import { Item } from './item';
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
    <View className={styles.wrapper}>
      <ScrollView scrollY className={styles.scrollView}>
        <View className={styles.container}>
          <View className={styles.list}>
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
                  <Item onClick={handleCategorySelect} onEdit={handleEditCategory} />
                </Fragment>
              );
            })}
          </View>
        </View>
        <SafeAreaBar inset='bottom' />
      </ScrollView>
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
    </View>
  );
}
