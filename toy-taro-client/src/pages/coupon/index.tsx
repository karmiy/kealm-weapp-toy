import { useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { SafeAreaBar, TabPanel, Tabs, WhiteSpace } from '@/components';
import { CouponList } from '@/container';
import styles from './index.module.scss';

export default function () {
  const couponTypes = ['待使用', '已使用', '已过期'];
  const [current, setCurrent] = useState(0);
  const couponList = [
    {
      id: '1',
      score: 50,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '2',
      score: 20,
      condition: '满199可用',
      title: '美乐蒂玩具专享券',
      range: '仅限玩具类商品',
      period: '2024-12-31',
      disabled: true,
    },
    {
      id: '3',
      score: 100,
      condition: '满299可用',
      title: '节日特惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '4',
      score: 40,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '5',
      score: 80,
      condition: '满399可用',
      title: '高分兑换券',
      range: '指定商品适用',
      period: '2025-01-31',
    },
    {
      id: '6',
      score: 30,
      condition: '无门槛',
      title: '周末特惠券',
      range: '全场商品可用',
      period: '2025-02-28',
    },
    {
      id: '7',
      score: 60,
      condition: '满150可用',
      title: '文具专享券',
      range: '仅限文具类商品',
      period: '2024-12-31',
    },
    {
      id: '8',
      score: 25,
      condition: '满50可用',
      title: '亲子活动券',
      range: '活动体验类商品',
      period: '2025-01-15',
    },
    {
      id: '9',
      score: 90,
      condition: '满499可用',
      title: '大额满减券',
      range: '全场商品可用',
      period: '2025-03-01',
    },
  ];

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
        {couponTypes.map((item, index) => {
          return (
            <TabPanel key={item} label={item} isScrollable>
              <View className={styles.tabsContent}>
                <CouponList list={couponList} />
              </View>
            </TabPanel>
          );
        })}
      </Tabs>
      <SafeAreaBar isWhiteBg inset='bottom' />
    </View>
  );
}
