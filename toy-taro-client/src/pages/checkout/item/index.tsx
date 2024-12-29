import { useState } from 'react';
import { Image, Text, View } from '@tarojs/components';
import { CheckButton, Icon, Stepper } from '@/components';
import { ToyScore } from '@/container';
import { COLOR_VARIABLES } from '@/utils/constants';
import styles from './index.module.scss';

interface ItemProps {
  title: string;
  coverImage: string;
  currentScore: number;
  originalScore?: number;
  count?: number;
}

const Item = (props: ItemProps) => {
  const { title, coverImage, currentScore, originalScore, count = 1 } = props;
  return (
    <View className={styles.wrapper}>
      <Image src={coverImage} mode='aspectFill' lazyLoad className={styles.coverImage} />
      <View className={styles.info}>
        <Text className={styles.title}>{title}</Text>
        <View className={styles.detail}>
          <ToyScore current={currentScore} original={originalScore} />
          <Text>x{count}</Text>
        </View>
      </View>
    </View>
  );
};

export { Item };
