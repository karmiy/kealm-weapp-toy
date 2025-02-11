import { Text, View } from '@tarojs/components';
import { FallbackImage } from '@ui/components';
import styles from './index.module.scss';

interface ItemProps {
  title: string;
  coverImage: string;
  onClick?: () => void;
}

const Item = (props: ItemProps) => {
  const { title, coverImage, onClick } = props;
  return (
    <View className={styles.wrapper} onClick={onClick}>
      <View className={styles.container}>
        <Text className={styles.title}>{title}</Text>
        <View className={styles.coverWrapper}>
          <View className={styles.coverContainer}>
            <FallbackImage src={coverImage} className={styles.coverImage} />
          </View>
        </View>
      </View>
    </View>
  );
};

export { Item };
