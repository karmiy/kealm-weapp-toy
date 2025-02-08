import { useState } from 'react';
import { Text, View } from '@tarojs/components';
import { TAB_BAR_ID } from '@shared/tabBar';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { TASK_TYPE_LIST } from '@core';
import { FallbackImage, Icon, TabPanel, Tabs, WhiteSpace } from '@ui/components';
import { withCustomTabBar } from '@ui/hoc';
import { useSyncOnPageShow } from '@ui/hooks';
import { useUserInfo } from '@ui/viewModel';
import { TaskCategory } from './components';
import styles from './index.module.scss';

function Task() {
  useSyncOnPageShow();

  const { isAdmin, score } = useUserInfo();
  const [current, setCurrent] = useState(0);

  return (
    <View className={styles.wrapper}>
      <WhiteSpace size='medium' />
      {isAdmin ? (
        <View className={styles.adminHeader}>
          <View
            className={styles.action}
            onClick={() => navigateToPage({ pageName: PAGE_ID.TASK_MANAGE })}
          >
            <Icon name='add' color={COLOR_VARIABLES.COLOR_RED} />
            新增
          </View>
        </View>
      ) : (
        <View className={styles.userHeader}>
          <View className={styles.scoreWrapper}>
            <Text className={styles.title}>当前积分</Text>
            <Text className={styles.score}>{score}</Text>
          </View>
          <FallbackImage
            src='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/task-header.png'
            className={styles.avatar}
          />
        </View>
      )}
      <WhiteSpace size='medium' />
      <Tabs
        className={styles.tabs}
        classes={{ headerContainer: styles.tabsHeader }}
        current={current}
        onChange={setCurrent}
        variant='contained'
        mode='horizontal'
      >
        {TASK_TYPE_LIST.map(item => {
          return (
            <TabPanel className={styles.tabPanel} key={item.type} label={item.label}>
              <TaskCategory type={item.type} />
            </TabPanel>
          );
        })}
      </Tabs>
    </View>
  );
}

const TaskPage = withCustomTabBar(Task, {
  tabBarId: TAB_BAR_ID.TASK,
});

export default TaskPage;
