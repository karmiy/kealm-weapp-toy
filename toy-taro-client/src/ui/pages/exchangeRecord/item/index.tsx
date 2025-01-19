import { useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { Button } from '@ui/components';
import { ProductCard } from '@ui/container';
import styles from './index.module.scss';

interface ItemProps {
  title: string;
  coverImage: string;
  discountedScore?: number;
  originalScore: number;
  handleUndo?: () => void;
}

const Item = (props: ItemProps) => {
  const { title, coverImage, discountedScore, originalScore, handleUndo } = props;

  const subTitle = useMemo(() => {
    return (
      <View className={styles.subTitle}>
        <Text>
          30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm
          粉色30cm 粉色30cm 粉色
        </Text>
        <Text>兑换时间: 2014-01-01</Text>
      </View>
    );
  }, []);
  return (
    <View className={styles.wrapper}>
      <ProductCard
        className={styles.card}
        mode='horizontal'
        paddingSize='none'
        title={title}
        subTitle={subTitle}
        coverImage={coverImage}
        discountedScore={discountedScore}
        originalScore={originalScore}
        action={
          <Button
            size='small'
            type='plain'
            onClick={() => {
              handleUndo?.();
            }}
          >
            撤销
          </Button>
        }
      />
    </View>
  );
};

export { Item };
