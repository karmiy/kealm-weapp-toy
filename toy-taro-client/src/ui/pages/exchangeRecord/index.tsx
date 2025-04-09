import { Fragment, useEffect } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { setNavigationBarTitle } from '@tarojs/taro';
import { sdk, STORE_NAME } from '@core';
import { SafeAreaBar, StatusWrapper, WhiteSpace } from '@ui/components';
import { useSyncOnPageShow } from '@ui/hooks';
import { useStoreIds, useStoreLoadingStatus, useUserInfo } from '@ui/viewModel';
import { RecordItem } from './components';
import styles from './index.module.scss';

export default function () {
  const { scrollViewRefreshProps } = useSyncOnPageShow({ enableSyncOnPageShow: false });
  const ids = useStoreIds(STORE_NAME.ORDER);
  const loading = useStoreLoadingStatus(STORE_NAME.ORDER);
  const { isAdmin } = useUserInfo();

  useEffect(() => {
    // load order list
    sdk.modules.order.syncOrderList();
  }, []);

  useEffect(() => {
    setNavigationBarTitle({
      title: isAdmin ? '订单管理' : '兑换记录',
    });
  }, [isAdmin]);

  return (
    <View className={styles.wrapper}>
      <StatusWrapper loading={loading} loadingIgnoreCount count={ids.length} size='fill'>
        <View className={styles.list}>
          <ScrollView scrollY className={styles.scrollView} {...scrollViewRefreshProps}>
            <View className={styles.container}>
              {ids.map(id => {
                return (
                  <Fragment key={id}>
                    <WhiteSpace size='medium' />
                    <RecordItem id={id} />
                  </Fragment>
                );
              })}
              <WhiteSpace size='medium' />
            </View>
          </ScrollView>
        </View>
      </StatusWrapper>
      <SafeAreaBar inset='bottom' />
    </View>
  );
}
