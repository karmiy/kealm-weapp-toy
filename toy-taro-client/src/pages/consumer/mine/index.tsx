import { useMemo, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import styles from './index.module.scss';

export default function () {
  return (
    <View
      className={clsx({
        [styles.header]: true,
      })}
    >
      <Text>mine</Text>
    </View>
  );
}
