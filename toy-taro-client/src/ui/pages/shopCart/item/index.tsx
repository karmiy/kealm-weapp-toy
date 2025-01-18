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
}

const Item = (props: ItemProps) => {
  const { id, onUpdateQuantityError } = props;
  const toyShotCart = useStoreById(STORE_NAME.TOY_SHOP_CART, id);
  const toy = useStoreById(STORE_NAME.TOY, toyShotCart?.productId ?? '-1');
  const [checked, setChecked] = useState(false);
  const [count, setCount] = useState(() => {
    if (!toy?.stock || !toyShotCart?.quantity) {
      return 1;
    }
    return Math.max(Math.min(toy.stock, toyShotCart.quantity), 1);
  });
  const { updateToyShopCart } = useToyShopCart(id);

  const handleUpdateCount = useCallback(
    async (quantity: number) => {
      setCount(quantity);
      await updateToyShopCart(quantity, prevQuantity => {
        setCount(prevQuantity);
        onUpdateQuantityError?.();
      });
    },
    [updateToyShopCart, onUpdateQuantityError],
  );

  if (!toyShotCart || !toy || !count) {
    return null;
  }
  const { name, desc, coverImage, discountedScore, originalScore } = toy;

  return (
    <View className={styles.wrapper}>
      <CheckButton className={styles.select} checked={checked} onChange={setChecked} />
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
