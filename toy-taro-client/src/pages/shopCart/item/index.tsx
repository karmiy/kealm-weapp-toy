import { useState } from 'react';
import { Image, Text, View } from '@tarojs/components';
import { CheckButton, Icon, Stepper } from '@/components';
import { ToyCard, ToyScore } from '@/container';
import { COLOR_VARIABLES } from '@/utils/constants';
import styles from './index.module.scss';

interface ItemProps {
  title: string;
  coverImage: string;
  currentScore: number;
  originalScore?: number;
}

const Item = (props: ItemProps) => {
  const { title, coverImage, currentScore, originalScore } = props;
  const [checked, setChecked] = useState(false);
  return (
    <View className={styles.wrapper}>
      <CheckButton className={styles.select} checked={checked} onChange={setChecked} />
      <ToyCard
        className={styles.card}
        mode='horizontal'
        paddingSize='none'
        title={title}
        subTitle='30cm 粉色'
        coverImage={coverImage}
        currentScore={currentScore}
        originalScore={originalScore}
        action={<Stepper min={0} />}
      />
    </View>
  );
};

export { Item };
