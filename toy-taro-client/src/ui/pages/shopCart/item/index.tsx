import { useCallback, useState } from 'react';
import { View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { CheckButton, Stepper } from '@ui/components';
import { ProductCard } from '@ui/container';
import { useOperateFeedback } from '@ui/hoc';
import { useProductShopCart, useStoreById } from '@ui/viewModel';
import styles from './index.module.scss';

interface ItemProps {
  id: string;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
}

const Item = (props: ItemProps) => {
  const { id, checked = false, onChecked } = props;
  const productShotCart = useStoreById(STORE_NAME.PRODUCT_SHOP_CART, id);
  const product = useStoreById(STORE_NAME.PRODUCT, productShotCart?.productId);
  const [count, setCount] = useState(() => {
    if (!product?.stock || !productShotCart?.quantity) {
      return 1;
    }
    return Math.max(Math.min(product.stock, productShotCart.quantity), 1);
  });
  const { updateProductShopCart } = useProductShopCart();
  const { openToast } = useOperateFeedback();

  const handleUpdateCount = useCallback(
    async (quantity: number) => {
      setCount(quantity);
      await updateProductShopCart(id, quantity, {
        fallback: prevQuantity => {
          setCount(prevQuantity);
          openToast({ text: '商品数量更新失败！' });
        },
      });
    },
    [updateProductShopCart, id, openToast],
  );

  if (!productShotCart || !product || !count) {
    return null;
  }
  const { name, desc, coverImage, discountedScore, originalScore } = product;

  return (
    <View className={styles.wrapper}>
      <CheckButton className={styles.select} checked={checked} onChange={v => onChecked?.(v)} />
      <ProductCard
        className={styles.card}
        mode='horizontal'
        paddingSize='none'
        title={name}
        subTitle={desc}
        coverImage={coverImage}
        discountedScore={discountedScore}
        originalScore={originalScore}
        action={<Stepper min={0} max={product.stock} value={count} onChange={handleUpdateCount} />}
      />
    </View>
  );
};

export { Item };
