import { View } from '@tarojs/components';
import { ToyCard } from '@/container';
import styles from './index.module.scss';

const demoList = [
  {
    content:
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-melody-banner.png',
  },
  {
    content:
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-melody-banner.png',
  },
  {
    content:
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-melody-banner.png',
  },
];

const ToyList = () => {
  return (
    <View className={styles.wrapper}>
      <View className={styles.container}>
        {[...Array(12).keys()].map(index => {
          return (
            <View key={index} className={styles.itemWrapper}>
              <ToyCard
                coverImage='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-toy-card-1.png'
                title='美乐蒂经典款毛绒玩偶'
                count={1}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export { ToyList };
