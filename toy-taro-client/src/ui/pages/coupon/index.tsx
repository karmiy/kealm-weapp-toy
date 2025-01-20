import { useState } from 'react';
import { View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { SafeAreaBar, StatusWrapper, TabPanel, Tabs } from '@ui/components';
import { CouponList } from '@ui/container';
import { useCoupon, useStoreLoadingStatus } from '@ui/viewModel';
import styles from './index.module.scss';

export default function () {
  const [current, setCurrent] = useState(0);
  const loading = useStoreLoadingStatus(STORE_NAME.COUPON);
  const { activeCoupons, usedCoupons, expiredCoupons } = useCoupon({
    enableActiveIds: true,
    enableUsedIds: true,
    enableExpiredIds: true,
  });

  return (
    <View className={styles.wrapper}>
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
        <TabPanel label='待使用' isScrollable>
          <View className={styles.tabsContent}>
            <StatusWrapper loading={loading} count={activeCoupons.length}>
              <CouponList list={activeCoupons} />
            </StatusWrapper>
          </View>
        </TabPanel>
        <TabPanel label='已使用' isScrollable>
          <View className={styles.tabsContent}>
            <StatusWrapper loading={loading} count={usedCoupons.length}>
              <CouponList list={usedCoupons} />
            </StatusWrapper>
          </View>
        </TabPanel>
        <TabPanel label='已过期' isScrollable>
          <View className={styles.tabsContent}>
            <StatusWrapper loading={loading} count={expiredCoupons.length}>
              <CouponList list={expiredCoupons} />
            </StatusWrapper>
          </View>
        </TabPanel>
      </Tabs>
      <SafeAreaBar isWhiteBg inset='bottom' />
    </View>
  );
}
