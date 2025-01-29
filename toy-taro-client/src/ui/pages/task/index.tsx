import { useState } from 'react';
import { Text, View } from '@tarojs/components';
import { TAB_BAR_ID } from '@shared/tabBar';
import { TASK_TYPE } from '@core';
import { FallbackImage, TabPanel, Tabs, WhiteSpace } from '@ui/components';
import { withCustomTabBar } from '@ui/hoc';
import { TaskCategory } from './components';
import styles from './index.module.scss';

const TASK_TYPE_LIST = [
  {
    type: TASK_TYPE.DAILY,
    label: '每日任务',
  },
  {
    type: TASK_TYPE.WEEKLY,
    label: '每周任务',
  },
  {
    type: TASK_TYPE.TIMED,
    label: '限时任务',
  },
  {
    type: TASK_TYPE.CHALLENGE,
    label: '挑战任务',
  },
];

function Task() {
  const [current, setCurrent] = useState(0);
  return (
    <View className={styles.wrapper}>
      <WhiteSpace size='medium' />
      <View className={styles.header}>
        <View className={styles.scoreWrapper}>
          <Text className={styles.title}>当前积分</Text>
          <Text className={styles.score}>2580</Text>
          {/* <View className={styles.checkEntry}>
            <Text>查看当前积分</Text>
            <Icon name='arrow-right' size={10} color={COLOR_VARIABLES.COLOR_RED} />
          </View> */}
        </View>
        <FallbackImage
          src='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/task-header.png'
          className={styles.avatar}
        />
      </View>
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
