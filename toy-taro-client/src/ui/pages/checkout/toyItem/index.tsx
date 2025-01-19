import { Text } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { ToyCard } from '@ui/container';
import { useStoreById } from '@ui/viewModel';

interface ToyItemProps {
  id: string;
}

const ToyItem = (props: ToyItemProps) => {
  const { id } = props;
  const toyShotCart = useStoreById(STORE_NAME.TOY_SHOP_CART, id);
  const toy = useStoreById(STORE_NAME.TOY, toyShotCart?.productId);

  if (!toyShotCart || !toy) {
    return null;
  }

  const { name, desc, coverImage, discountedScore, originalScore } = toy;
  return (
    <ToyCard
      mode='horizontal'
      paddingSize='none'
      title={name}
      subTitle={desc}
      coverImage={coverImage}
      discountedScore={discountedScore}
      originalScore={originalScore}
      action={<Text>x{toyShotCart.quantity}</Text>}
    />
  );
};

export { ToyItem };
