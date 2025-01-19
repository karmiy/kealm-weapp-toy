import { useCallback, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { CheckButton, Stepper } from '@ui/components';
import { ToyCard } from '@ui/container';
import { useStoreById, useToyShopCart } from '@ui/viewModel';
import styles from './index.module.scss';

interface ItemProps {
  id: string;
  onUpdateQuantityError?: () => void;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
}

const Item = (props: ItemProps) => {
  const { id, onUpdateQuantityError, checked = false, onChecked } = props;
  const toyShotCart = useStoreById(STORE_NAME.TOY_SHOP_CART, id);
  const toy = useStoreById(STORE_NAME.TOY, toyShotCart?.productId);
  const [count, setCount] = useState(() => {
    if (!toy?.stock || !toyShotCart?.quantity) {
      return 1;
    }
    return Math.max(Math.min(toy.stock, toyShotCart.quantity), 1);
  });
  const { updateToyShopCart } = useToyShopCart();

  const handleUpdateCount = useCallback(
    async (quantity: number) => {
      setCount(quantity);
      await updateToyShopCart(id, quantity, prevQuantity => {
        setCount(prevQuantity);
        onUpdateQuantityError?.();
      });
    },
    [id, updateToyShopCart, onUpdateQuantityError],
  );

  if (!toyShotCart || !toy || !count) {
    return null;
  }
  const { name, desc, coverImage, discountedScore, originalScore } = toy;

  return (
    <View className={styles.wrapper}>
      <CheckButton className={styles.select} checked={checked} onChange={v => onChecked?.(v)} />
      <ToyCard
        className={styles.card}
        mode='horizontal'
        paddingSize='none'
        title={name}
        subTitle={desc}
        coverImage={coverImage}
        discountedScore={discountedScore}
        originalScore={originalScore}
        action={<Stepper min={0} max={toy.stock} value={count} onChange={handleUpdateCount} />}
      />
    </View>
  );
};

export { Item };
