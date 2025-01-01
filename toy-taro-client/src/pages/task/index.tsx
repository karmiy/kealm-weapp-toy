import { useState } from 'react';
import { Image, ScrollView, Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { Icon, TabPanel, Tabs, WhiteSpace } from '@/components';
import { COLOR_VARIABLES } from '@/utils/constants';
import styles from './index.module.scss';

export default function () {
  const [current, setCurrent] = useState(0);
  const items = [
    '每日任务',
    '每周任务',
    '限时任务',
    '挑战任务',
    '其他任务1',
    '其他任务2',
    '其他任务3',
    '其他任务44444',
  ];
  return (
    <ScrollView scrollY className={styles.wrapper}>
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
      {/* <Tabs current={current} onChange={setCurrent} variant='contained'>
        {items.map((item, index) => {
          return (
            <TabPanel key={item} label={item}>
              <View>content</View>
            </TabPanel>
          );
        })}
      </Tabs> */}
      <Tabs
        style={{ height: 200 }}
        current={current}
        onChange={setCurrent}
        variant='contained'
        mode='vertical'
      >
        {items.map((item, index) => {
          return (
            <TabPanel key={item} label={item}>
              <View style={{ height: 400 }}>content</View>
            </TabPanel>
          );
        })}
      </Tabs>
      <WhiteSpace size='medium' />
      <Tabs
        style={{ height: 200 }}
        current={current}
        onChange={setCurrent}
        variant='text'
        mode='vertical'
      >
        {items.map((item, index) => {
          return (
            <TabPanel key={item} label={item}>
              <View style={{ height: 400 }}>content</View>
            </TabPanel>
          );
        })}
      </Tabs>
      <WhiteSpace size='medium' />
      <Tabs current={current} onChange={setCurrent} variant='contained' mode='horizontal'>
        {items.map((item, index) => {
          return (
            <TabPanel key={item} label={item}>
              <View style={{ height: 400 }}>content</View>
            </TabPanel>
          );
        })}
      </Tabs>
      <WhiteSpace size='medium' />
      <Tabs current={current} onChange={setCurrent} variant='text' mode='horizontal'>
        {items.map((item, index) => {
          return (
            <TabPanel key={item} label={item}>
              <View style={{ height: 400 }}>content</View>
            </TabPanel>
          );
        })}
      </Tabs>
    </ScrollView>
  );
}
