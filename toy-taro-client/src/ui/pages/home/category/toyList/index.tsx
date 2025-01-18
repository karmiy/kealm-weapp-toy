import { View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { IconButton, StatusWrapper } from '@ui/components';
import { ToyCard } from '@ui/container';
import { useStoreById, useStoreLoadingStatus, useToyCategory } from '@ui/viewModel';
import styles from './index.module.scss';

interface ToyListProps {
  categoryId: string;
}

interface ToyItemProps {
  id: string;
}

const ToyItem = (props: ToyItemProps) => {
  const toy = useStoreById(STORE_NAME.TOY, props.id);
  if (!toy) {
    return null;
  }
  const { coverImage, name, stock, discountedScore, originalScore } = toy;
  return (
    <View className={styles.itemWrapper}>
      <ToyCard
        coverImage={coverImage}
        title={name}
        paddingSize='small'
        subTitle={`库存: ${stock}`}
        discountedScore={discountedScore}
        originalScore={originalScore}
        action={<IconButton name='cart-add-fill' />}
      />
    </View>
  );
};

const ToyList = (props: ToyListProps) => {
  const { categoryId } = props;
  const { toyIds } = useToyCategory({
    categoryId,
  });
  const loading = useStoreLoadingStatus(STORE_NAME.TOY);
  return (
    <View className={styles.wrapper}>
      <View className={styles.container}>
        <StatusWrapper loading={loading} count={toyIds.length}>
          {toyIds.map(id => {
            return <ToyItem key={id} id={id} />;
          })}
        </StatusWrapper>
      </View>
    </View>
  );
};

export { ToyList };
