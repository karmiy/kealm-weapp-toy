import { useEffect } from 'react';
import { Text, View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { FallbackImage } from '@ui/components';
import { ProductScore } from '@ui/container';
import { PREVIEW_IMAGE_ID, previewImageManager } from '@ui/manager/previewImageManager';
import { useStoreById } from '@/ui/viewModel';
import styles from './index.module.scss';

interface ItemProps {
  id: string;
}

const Item = (props: ItemProps) => {
  const { id } = props;
  const product = useStoreById(STORE_NAME.PRODUCT, id);
  const productCategory = useStoreById(STORE_NAME.PRODUCT_CATEGORY, product?.categoryId);
  const { coverImage } = product ?? {};

  useEffect(() => {
    if (!coverImage) {
      return;
    }
    previewImageManager.register(PREVIEW_IMAGE_ID.LIMITED_TIME_OFFER, coverImage);
    return () => previewImageManager.unregister(PREVIEW_IMAGE_ID.LIMITED_TIME_OFFER, coverImage);
  }, [coverImage]);

  const handlePreview = () => {
    if (!coverImage) {
      return;
    }
    previewImageManager.preview({
      id: PREVIEW_IMAGE_ID.LIMITED_TIME_OFFER,
      current: coverImage,
    });
  };

  if (!product) {
    return null;
  }

  const { name, originalScore, discountedScore } = product;

  return (
    <View className={styles.wrapper}>
      <View className={styles.imgWrapper}>
        {coverImage ? (
          <FallbackImage className={styles.img} src={coverImage} onClick={handlePreview} />
        ) : null}
      </View>
      <Text className={styles.title}>{name}</Text>
      <Text className={styles.subTitle}>分类: {productCategory?.name}</Text>
      <ProductScore discounted={discountedScore} original={originalScore} colorMode='inverse' />
    </View>
  );
};

export { Item };
