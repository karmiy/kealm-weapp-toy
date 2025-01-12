import { useState } from 'react';
import { View } from '@tarojs/components';
import { CheckButton, Stepper } from '@ui/components';
import { ToyCard } from '@ui/container';
import styles from './index.module.scss';

interface ItemProps {
  title: string;
  coverImage: string;
  discountedScore?: number;
  originalScore: number;
}

const Item = (props: ItemProps) => {
  const { title, coverImage, discountedScore, originalScore } = props;
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
        discountedScore={discountedScore}
        originalScore={originalScore}
        action={<Stepper min={0} />}
      />
    </View>
  );
};

export { Item };
