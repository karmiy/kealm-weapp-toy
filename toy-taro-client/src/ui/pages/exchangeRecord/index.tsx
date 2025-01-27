import { Fragment, useEffect } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { sdk, STORE_NAME } from '@core';
import { SafeAreaBar, StatusWrapper, WhiteSpace } from '@ui/components';
import { useStoreIds, useStoreLoadingStatus } from '@ui/viewModel';
import { Item } from './item';
import styles from './index.module.scss';

export default function () {
  const ids = useStoreIds(STORE_NAME.ORDER);
  const loading = useStoreLoadingStatus(STORE_NAME.ORDER);

  useEffect(() => {
    // load order list
    sdk.modules.order.syncOrderList();
  }, []);

  return (
    <View className={styles.wrapper}>
      <StatusWrapper loading={loading} count={ids.length} size='fill'>
        <View className={styles.list}>
          <ScrollView scrollY className={styles.scrollView}>
            <View className={styles.container}>
              {ids.map(id => {
                return (
                  <Fragment key={id}>
                    <WhiteSpace size='medium' />
                    <Item id={id} />
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
