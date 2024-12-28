import { Image, Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { IconButton } from '@/components';
import { ToyScore } from '@/container';
import styles from './index.module.scss';

interface ToyCardProps {
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
  coverImage: string;
  title: string;
  count: number;
}

const ToyCard = (props: ToyCardProps) => {
  const { className, style, width, coverImage, title, count } = props;

  return (
    <View
      className={clsx(styles.wrapper, className)}
      style={{
        ...style,
        width,
      }}
    >
      <View className={styles.coverWrapper}>
        <View className={styles.coverContainer}>
          <Image src={coverImage} mode='aspectFill' lazyLoad className={styles.coverImage} />
        </View>
      </View>
      <Text className={styles.title}>{title}</Text>
      <Text className={styles.subTitle}>库存: {count}</Text>
      <View className={styles.operateWrapper}>
        <ToyScore current={100} original={120} />
        <IconButton name='cart-add-fill' />
      </View>
    </View>
  );
};

export { ToyCard };
