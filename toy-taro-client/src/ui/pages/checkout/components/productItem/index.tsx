import { Text } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { ProductCard } from '@ui/container';
import { useStoreById } from '@ui/viewModel';

interface ProductItemProps {
  id: string;
}

const ProductItem = (props: ProductItemProps) => {
  const { id } = props;
  const productShotCart = useStoreById(STORE_NAME.PRODUCT_SHOP_CART, id);
  const product = useStoreById(STORE_NAME.PRODUCT, productShotCart?.productId);

  if (!productShotCart || !product) {
    return null;
  }

  const { name, desc, coverImage, discountedScore, originalScore, isLimitedTimeOffer } = product;
  return (
    <ProductCard
      mode='horizontal'
      paddingSize='none'
      title={name}
      subTitle={desc}
      coverImage={coverImage}
      discountedScore={discountedScore}
      originalScore={originalScore}
      isLimitedTimeOffer={isLimitedTimeOffer}
      action={<Text>x{productShotCart.quantity}</Text>}
    />
  );
};

export { ProductItem };
