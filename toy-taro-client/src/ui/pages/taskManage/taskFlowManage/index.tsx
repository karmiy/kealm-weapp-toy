import { Fragment } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { STORE_NAME } from '@core';
import { SafeAreaBar, StatusWrapper, WhiteSpace } from '@ui/components';
import { useSyncOnPageShow } from '@ui/hooks';
import { useStoreIds, useStoreLoadingStatus } from '@ui/viewModel';
import { TaskFlowItem } from './components';
import styles from './index.module.scss';

export default function () {
  const { handleRefresh, refresherTriggered } = useSyncOnPageShow();
  const ids = useStoreIds(STORE_NAME.TASK_FLOW);
  const loading = useStoreLoadingStatus(STORE_NAME.TASK_FLOW);

  return (
    <View className={styles.wrapper}>
      <StatusWrapper loading={loading} count={ids.length} size='fill'>
        <View className={styles.list}>
          <ScrollView
            scrollY
            className={styles.scrollView}
            refresherEnabled
            refresherTriggered={refresherTriggered}
            refresherBackground={COLOR_VARIABLES.FILL_BODY}
            onRefresherRefresh={handleRefresh}
          >
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
