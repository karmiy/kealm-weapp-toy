import { View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { IconButton, StatusWrapper } from '@ui/components';
import { ProductCard } from '@ui/container';
import { useProductGroup, useStoreById, useStoreLoadingStatus } from '@ui/viewModel';
import styles from './index.module.scss';

interface ProductListProps {
  categoryId: string;
  onAddToCart?: (id: string) => void;
}

interface ProductItemProps {
  id: string;
  onAddToCart?: (id: string) => void;
}

const ProductItem = (props: ProductItemProps) => {
  const { id, onAddToCart } = props;
  const product = useStoreById(STORE_NAME.PRODUCT, id);
  if (!product) {
    return null;
  }
  const { coverImage, name, stock, discountedScore, originalScore } = product;
  return (
    <View className={styles.itemWrapper}>
      <ProductCard
        coverImage={coverImage}
        title={name}
        paddingSize='small'
        subTitle={`库存: ${stock}`}
        discountedScore={discountedScore}
        originalScore={originalScore}
        action={<IconButton name='cart-add-fill' onClick={() => onAddToCart?.(id)} />}
      />
    </View>
  );
};

const ProductList = (props: ProductListProps) => {
  const { categoryId, onAddToCart } = props;
  const { productIds } = useProductGroup({
    categoryId,
  });
  const loading = useStoreLoadingStatus(STORE_NAME.PRODUCT);
  return (
    <View className={styles.wrapper}>
      <View className={styles.container}>
        <StatusWrapper loading={loading} count={productIds.length}>
          {productIds.map(id => {
            return <ProductItem key={id} id={id} onAddToCart={onAddToCart} />;
          })}
        </StatusWrapper>
      </View>
    </View>
  );
};

export { ProductList };
