import { useMemo } from 'react';
import { View } from '@tarojs/components';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import { IconButton, StatusWrapper } from '@ui/components';
import { ProductCard } from '@ui/container';
import { useProductGroup, useStoreById, useStoreLoadingStatus, useUserInfo } from '@ui/viewModel';
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
  const { isAdmin } = useUserInfo();
  const product = useStoreById(STORE_NAME.PRODUCT, id);

  const Action = useMemo(() => {
    if (!isAdmin) {
      return <IconButton name='cart-add-fill' onClick={() => onAddToCart?.(id)} />;
    }
    return (
      <IconButton
        name='edit'
        onClick={() =>
          navigateToPage({
            pageName: PAGE_ID.PRODUCT_MANAGE,
            params: { id },
          })
        }
      />
    );
  }, [isAdmin, id, onAddToCart]);

  if (!product) {
    return null;
  }
  const { coverImage, name, stock, discountedScore, originalScore, isLimitedTimeOffer } = product;

  return (
    <View className={styles.itemWrapper}>
      <ProductCard
        coverImage={coverImage}
        title={name}
        paddingSize='small'
        subTitle={`库存: ${stock}`}
        discountedScore={discountedScore}
        originalScore={originalScore}
        isLimitedTimeOffer={isLimitedTimeOffer}
        action={Action}
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
