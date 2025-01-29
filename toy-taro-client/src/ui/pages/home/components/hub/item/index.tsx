import { Text, View } from '@tarojs/components';
import { FallbackImage } from '@ui/components';
import styles from './index.module.scss';

interface ItemProps {
  title: string;
  coverImage: string;
}

const Item = (props: ItemProps) => {
  const { title, coverImage } = props;
  return (
    <View className={styles.wrapper}>
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
