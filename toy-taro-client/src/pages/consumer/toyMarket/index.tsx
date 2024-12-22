import { useMemo, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { OsButton, OsSearch } from 'ossaui';
import styles from './index.module.scss';

export default function () {
  return (
    <View className={styles.header}>
      <Text>toy market</Text>
      <OsSearch placeholder='搜索商品' />
      {/* <OsButton type='primary'>按钮</OsButton> */}
    </View>
  );
}
