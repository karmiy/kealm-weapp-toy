import { useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { STORE_NAME } from '@core';
import { StatusWrapper, TabPanel, Tabs } from '@ui/components';
import { CouponList } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import { useStoreLoadingStatus, useUserCouponList } from '@ui/viewModel';
import styles from './index.module.scss';

export function CouponUserPage() {
  const { handleRefresh, refresherTriggered } = useSyncOnPageShow();
  const scrollViewProps = useMemo(() => {
    return {
      refresherEnabled: true,
      refresherTriggered,
      refresherBackground: COLOR_VARIABLES.FILL_BODY,
      onRefresherRefresh: handleRefresh,
    };
  }, [handleRefresh, refresherTriggered]);
  const [current, setCurrent] = useState(0);
  const loading = useStoreLoadingStatus(STORE_NAME.COUPON);
  const { activeCoupons, usedCoupons, expiredCoupons } = useUserCouponList({
    enableActiveIds: true,
    enableUsedIds: true,
    enableExpiredIds: true,
  });

  return (
    <Tabs
      className={styles.tabs}
      classes={{
        headerContainer: styles.tabsHeaderContainer,
        headerItem: styles.tabsHeaderItem,
      }}
      variant='text'
      mode='horizontal'
      current={current}
      onChange={setCurrent}
    >
      <TabPanel label='待使用' isScrollable scrollViewProps={scrollViewProps}>
        <View className={styles.tabsContent}>
          <StatusWrapper loading={loading} count={activeCoupons.length}>
            <CouponList list={activeCoupons} />
          </StatusWrapper>
        </View>
      </TabPanel>
      <TabPanel label='已使用' isScrollable scrollViewProps={scrollViewProps}>
        <View className={styles.tabsContent}>
          <StatusWrapper loading={loading} count={usedCoupons.length}>
            <CouponList list={usedCoupons} />
          </StatusWrapper>
        </View>
      </TabPanel>
      <TabPanel label='已过期' isScrollable scrollViewProps={scrollViewProps}>
        <View className={styles.tabsContent}>
          <StatusWrapper loading={loading} count={expiredCoupons.length}>
            <CouponList list={expiredCoupons} />
          </StatusWrapper>
        </View>
      </TabPanel>
    </Tabs>
  );
}
