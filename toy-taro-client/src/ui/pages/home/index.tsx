import { ScrollView, View } from '@tarojs/components';
import { TAB_BAR_ID } from '@shared/tabBar';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { SafeAreaBar } from '@ui/components';
import { withCustomTabBar } from '@ui/hoc';
import { useSyncOnPageShow } from '@ui/hooks';
import { Carousel, Category, Hub, LimitedTimeOffer, TopBar } from './components';
import styles from './index.module.scss';

function Home() {
  const { handleRefresh, refresherTriggered } = useSyncOnPageShow({
    enablePagePullDownRefresh: false,
  });

  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <SafeAreaBar isWhiteBg />
        <TopBar />
      </View>
      <ScrollView
        scrollY
        className={styles.container}
        refresherEnabled
        refresherTriggered={refresherTriggered}
        refresherBackground={COLOR_VARIABLES.FILL_BODY}
        onRefresherRefresh={handleRefresh}
      >
        <Carousel />
        <LimitedTimeOffer />
        <Hub />
        <Category />
      </ScrollView>
    </View>
  );
}

const HomePage = withCustomTabBar(Home, {
  tabBarId: TAB_BAR_ID.HOME,
});

export default HomePage;
