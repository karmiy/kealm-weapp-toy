import { useEffect } from 'react';
import { Image, Text, View } from '@tarojs/components';
import { sdk, STORE_NAME } from '@core';
import { FallbackImage } from '@ui/components';
import { ToyScore } from '@ui/container';
import { PREVIEW_IMAGE_ID, previewImageManager } from '@ui/manager/previewImageManager';
import { useStoreById } from '@/ui/viewModel';
import styles from './index.module.scss';

interface ItemProps {
  id: string;
}

const Item = (props: ItemProps) => {
  const { id } = props;
  const toy = useStoreById(STORE_NAME.TOY, id);
  const { coverImage } = toy ?? {};

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
    previewImageManager.preview(PREVIEW_IMAGE_ID.LIMITED_TIME_OFFER, coverImage);
  };

  if (!toy) {
    return null;
  }

  const { name, originalScore, discountedScore } = toy;

  return (
    <View className={styles.wrapper}>
      <View className={styles.imgWrapper}>
        {coverImage ? (
          <FallbackImage className={styles.img} src={coverImage} onClick={handlePreview} />
        ) : null}
      </View>
      <Text className={styles.title}>{name}</Text>
      <ToyScore discounted={discountedScore} original={originalScore} colorMode='inverse' />
    </View>
  );
};

export { Item };
