import { Fragment, useEffect } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { sdk, STORE_NAME } from '@core';
import { SafeAreaBar, StatusWrapper, WhiteSpace } from '@ui/components';
import { useStoreIds, useStoreLoadingStatus, useUserInfo } from '@ui/viewModel';
import { TaskFlowItem } from './components';
import styles from './index.module.scss';

export default function () {
  const { isAdmin } = useUserInfo();
  const ids = useStoreIds(STORE_NAME.TASK_FLOW);
  const loading = useStoreLoadingStatus(STORE_NAME.TASK_FLOW);

  useEffect(() => {
    // load flow list
    isAdmin && sdk.modules.task.syncTaskFlowList();
  }, [isAdmin]);

  return (
    <View className={styles.wrapper}>
      <StatusWrapper loading={loading} count={ids.length} size='fill'>
        <View className={styles.list}>
          <ScrollView scrollY className={styles.scrollView}>
            <View className={styles.container}>
              {ids.map((id, index) => {
                return (
                  <Fragment key={id}>
                    {index !== 0 && <WhiteSpace size='medium' />}
                    <TaskFlowItem id={id} />
                  </Fragment>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </StatusWrapper>
      <SafeAreaBar inset='bottom' />
    </View>
  );
}
