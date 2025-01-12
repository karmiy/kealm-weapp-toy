import { sdk } from '@core';
import { ScrollView, View } from '@tarojs/components';
import { SafeAreaBar, WhiteSpace } from '@/ui/components';
import { Carousel } from './carousel';
import { Category } from './category';
import { Hub } from './hub';
import { LimitedTimeOffer } from './limitedTimeOffer';
import { TopBar } from './topBar';
import styles from './index.module.scss';

export default function () {
  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <SafeAreaBar isWhiteBg />
        <TopBar />
      </View>
      <ScrollView scrollY className={styles.container}>
        <Carousel />
        <LimitedTimeOffer />
        <Hub />
        <Category />
      </ScrollView>
    </View>
  );
}
