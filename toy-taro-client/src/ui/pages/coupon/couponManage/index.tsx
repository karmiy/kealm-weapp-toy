import { useCallback, useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import type { File } from 'taro-ui/types/image-picker';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { Button, ImagePicker, Input, PickerSelector, SafeAreaBar, Textarea } from '@ui/components';
import { FormItem } from '@ui/container';
import styles from './index.module.scss';

export default function () {
  const [pictures, setPictures] = useState<File[]>([]);
  const [categoryNum, setCategoryNum] = useState<number>();
  const categoryList = ['贴纸', '拼图', '益智', '咕卡'];

  const handleEditCategory = useCallback(() => {
    navigateToPage({ pageName: PAGE_ID.PRODUCT_CATEGORY_MANAGE });
  }, []);

  return (
    <View className={styles.wrapper}>
      <ScrollView scrollY className={styles.scrollView}>
        <View className={styles.container}>
          <View className={styles.list}>
            <FormItem title='商品图片' required>
              <ImagePicker
                count={1}
                showAddBtn={!pictures.length}
                files={pictures}
                onChange={e => {
                  console.log('[test] e', e);
                  setPictures(e);
                }}
              />
            </FormItem>
            <FormItem title='商品名称' required>
              <Input placeholder='请输入商品名称' />
            </FormItem>
            <FormItem title='商品描述' required>
              <Textarea placeholder='请输入商品描述' />
            </FormItem>
            <FormItem
              title='商品分类'
              required
              showSettingEntrance
              onSettingClick={handleEditCategory}
            >
              <PickerSelector
                placeholder='请选择商品名称'
                type='select'
                mode='selector'
                range={categoryList}
                onChange={e => setCategoryNum(Number(e.detail.value))}
                value={categoryNum}
              />
            </FormItem>
            <FormItem title='库存数量' required>
              {/* 注意 Number 下，可能输入 03 这种 */}
              <Input placeholder='请输入库存数量' type='number' />
            </FormItem>
            <FormItem title='兑换积分' required>
              <Input placeholder='请输入兑换积分' type='number' />
            </FormItem>
            <FormItem title='特惠积分'>
              <Input placeholder='请输入特惠积分' type='number' />
            </FormItem>
            <Button className={styles.saveButton} type='primary' size='large'>
              保存
            </Button>
          </View>
        </View>
        <SafeAreaBar inset='bottom' />
      </ScrollView>
    </View>
  );
}
