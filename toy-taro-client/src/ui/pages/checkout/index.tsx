import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { getCurrentInstance } from '@tarojs/taro';
import { Button, SafeAreaBar, WhiteSpace } from '@ui/components';
import { CouponActionSheet } from '@ui/container';
import { useToyShopCart } from '@ui/viewModel';
import { FormItem } from './formItem';
import { ToyItem } from './toyItem';
import styles from './index.module.scss';

export default function () {
  const [ids] = useState<string[]>(getCurrentInstance().router?.params?.ids?.split(',') || []);
  const { getToyShopCartScore } = useToyShopCart();

  const [couponVisible, setCouponVisible] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('1');
  const couponList = [
    {
      id: '1',
      type: 'selectable' as const,
      score: 50,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '2',
      type: 'unselectable' as const,
      score: 20,
      condition: '满199可用',
      title: '美乐蒂玩具专享券',
      range: '仅限玩具类商品',
      period: '2024-12-31',
    },
    {
      id: '3',
      type: 'selectable' as const,
      score: 100,
      condition: '满299可用',
      title: '节日特惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '4',
      type: 'selectable' as const,
      score: 40,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '5',
      type: 'selectable' as const,
      score: 40,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '6',
      type: 'selectable' as const,
      score: 40,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '7',
      type: 'selectable' as const,
      score: 40,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
  ];

  const scoreInfo = useMemo(() => {
    const totalScore = ids.reduce((acc, curr) => {
      return acc + getToyShopCartScore(curr);
    }, 0);

    return { totalScore };
  }, [getToyShopCartScore, ids]);

  return (
    <View className={styles.wrapper}>
      <View className={styles.detail}>
        <ScrollView scrollY className={styles.scrollView}>
          <View className={styles.container}>
            <View className={styles.area}>
              {ids.map((id, index) => {
                return (
                  <>
                    {index !== 0 ? <WhiteSpace isVertical line size='large' /> : null}
                    <ToyItem key={id} id={id} />
                  </>
                );
              })}
            </View>
            <WhiteSpace isVertical size='medium' />
            <View className={styles.area}>
              <FormItem
                mode='select'
                label='优惠券'
                text='满100减10'
                highlight
                onClick={() => setCouponVisible(true)}
              />
              <WhiteSpace isVertical size='medium' />
              <FormItem label='商品积分' text={`${scoreInfo.totalScore}积分`} />
              <WhiteSpace isVertical size='medium' />
              <FormItem label='优惠积分' text='-20积分' highlight />
              <WhiteSpace isVertical size='medium' />
              <FormItem label='实付积分' text='317积分' highlight emphasize />
            </View>
          </View>
        </ScrollView>
      </View>
      <View className={styles.actionWrapper}>
        <Text className={styles.tip}>共3件商品</Text>
        <Button>支付</Button>
      </View>
      <CouponActionSheet
        visible={couponVisible}
        list={couponList}
        selectedId={selectedCouponId}
        onSelect={setSelectedCouponId}
        onClose={() => setCouponVisible(false)}
      />
      <SafeAreaBar isWhiteBg inset='bottom' />
    </View>
  );
}
