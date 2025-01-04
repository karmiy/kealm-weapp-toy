import { useState } from 'react';
import { Image, Text, View } from '@tarojs/components';
import { TabPanel, Tabs, WhiteSpace } from '@/components';
import { TaskCategory } from './category';
import styles from './index.module.scss';

export default function () {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([
    '每日任务',
    '每周任务',
    '限时任务',
    '挑战任务',
  ]);

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
        <Image
          src='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/task-header.png'
          mode='aspectFill'
          lazyLoad
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
        {categoryList.map(category => {
          return (
            <TabPanel className={styles.tabPanel} key={category} label={category}>
              <TaskCategory />
            </TabPanel>
          );
        })}
      </Tabs>
    </View>
  );
}
