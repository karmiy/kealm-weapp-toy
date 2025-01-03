import { useEffect } from 'react';
import { Image, Text, View } from '@tarojs/components';
import { ToyScore } from '@/container';
import { PREVIEW_IMAGE_ID, previewImageManager } from '@/manager/previewImageManager';
import styles from './index.module.scss';

interface ItemProps {
  img: string;
  title: string;
  normalPrice: number;
  emphasizePrice: number;
}

const Item = (props: ItemProps) => {
  const { img, title, normalPrice, emphasizePrice } = props;

  useEffect(() => {
    previewImageManager.register(PREVIEW_IMAGE_ID.LIMITED_TIME_OFFER, img);
    return () => previewImageManager.unregister(PREVIEW_IMAGE_ID.LIMITED_TIME_OFFER, img);
  }, [img]);

  const handlePreview = () => {
    previewImageManager.preview(PREVIEW_IMAGE_ID.LIMITED_TIME_OFFER, img);
  };

  return (
    <View className={styles.wrapper}>
      <View className={styles.imgWrapper}>
        <Image
          className={styles.img}
          mode='aspectFill'
          lazyLoad
          src={img}
          onClick={handlePreview}
        />
      </View>
      <Text className={styles.title}>{title}</Text>
      <ToyScore current={emphasizePrice} original={normalPrice} colorMode='inverse' />
    </View>
  );
};

export { Item };
