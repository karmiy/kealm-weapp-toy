import { View } from '@tarojs/components';
import { SafeAreaBar, WhiteSpace } from '@/components';
import { Carousel } from './carousel';
import { LimitedTimeOffer } from './limitedTimeOffer';
import { TopBar } from './topBar';
import styles from './index.module.scss';

export default function () {
  return (
    <View className={styles.wrapper}>
      <SafeAreaBar isWhiteBg />
      <TopBar />
      <Carousel />
      <WhiteSpace size='large' />
      <LimitedTimeOffer />
    </View>
  );
}
