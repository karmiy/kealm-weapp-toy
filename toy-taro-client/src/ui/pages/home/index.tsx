import { ScrollView, View } from '@tarojs/components';
import { TAB_BAR_ID } from '@shared/tabBar';
import { SafeAreaBar } from '@ui/components';
import { withCustomTabBar, withOperateFeedback } from '@ui/hoc';
import { Carousel } from './carousel';
import { Category } from './category';
import { Hub } from './hub';
import { LimitedTimeOffer } from './limitedTimeOffer';
import { TopBar } from './topBar';
import styles from './index.module.scss';

function Home() {
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

const HomePage = withCustomTabBar(withOperateFeedback(Home, { enableToast: true }), {
  tabBarId: TAB_BAR_ID.HOME,
});

export default HomePage;
