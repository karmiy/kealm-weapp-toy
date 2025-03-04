import { useCallback, useState } from 'react';
import { View } from '@tarojs/components';
import { showToast } from '@shared/utils/operateFeedback';
import { STORE_NAME } from '@core';
import { CheckButton, Stepper } from '@ui/components';
import { ProductCard } from '@ui/container';
import { useProductShopCart, useStoreById } from '@ui/viewModel';
import styles from './index.module.scss';

interface ShopItemProps {
  id: string;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
}

const ShopItem = (props: ShopItemProps) => {
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

  const handleUpdateCount = useCallback(
    async (quantity: number) => {
      if (!product?.id) {
        showToast({ title: '商品不存在！' });
        return;
      }
      setCount(quantity);
      await updateProductShopCart({
        id,
        productId: product?.id,
        quantity,
        callback: {
          fallback: prevQuantity => {
            setCount(prevQuantity);
          },
        },
      });
    },
    [updateProductShopCart, id, product?.id],
  );

  if (!productShotCart || !product || !count) {
    return null;
  }
  const { name, desc, coverImageUrl, discountedScore, originalScore, isLimitedTimeOffer } = product;

  return (
    <View className={styles.wrapper}>
      <CheckButton className={styles.select} checked={checked} onChange={v => onChecked?.(v)} />
      <ProductCard
        className={styles.card}
        mode='horizontal'
        paddingSize='none'
        title={name}
        subTitle={desc}
        coverImage={coverImageUrl}
        discountedScore={discountedScore}
        originalScore={originalScore}
        isLimitedTimeOffer={isLimitedTimeOffer}
        action={<Stepper min={0} max={product.stock} value={count} onChange={handleUpdateCount} />}
      />
    </View>
  );
};

export { ShopItem };
