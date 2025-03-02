import { useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { LUCKY_DRAW_TYPE } from '@core';
import { LuckyGrid, LuckyWheel, SafeAreaBar, StatusView } from '@ui/components';
import { useLuckyDrawItem } from '@ui/viewModel';
import styles from './index.module.scss';

const LEVEL_TITLES = ['SSR', 'SR', 'R'];

export default function () {
  const router = useRouter();
  const luckyDrawId = router.params.id;
  const { luckDraw } = useLuckyDrawItem({
    id: luckyDrawId,
  });

  const LuckyCanvas = useMemo(() => {
    if (!luckDraw) {
      return <StatusView type='empty' size='fill' />;
    }
    if (luckDraw.type === LUCKY_DRAW_TYPE.WHEEL) {
      return (
        <LuckyWheel
          width={300}
          prizes={luckDraw.prizes}
          onEnd={(id, text) => {
            // showToast({
            //   title: `恭喜你获得${text}`,
            // });
          }}
        />
      );
    }
    if (luckDraw.type === LUCKY_DRAW_TYPE.GRID) {
      return (
        <LuckyGrid
          width={300}
          prizes={luckDraw.prizes}
          onEnd={(id, text) => {
            // showToast({
            //   title: `恭喜你获得${text}`,
            // });
          }}
        />
      );
    }
    return null;
  }, [luckDraw]);

  const LuckyRule = useMemo(() => {
    if (!luckDraw) {
      return null;
    }

    const levelItems = luckDraw.levelPrizeItems.slice(0, 3);
    return (
      <View className={styles.ruleWrapper}>
        <View className={styles.title}>祈愿信息</View>
        <View className={styles.rule}>
          1.每次祈愿消耗 <Text className={styles.highlight}>{luckDraw.quantity}</Text> 张祈愿券
        </View>
        <View className={styles.rule}>
          <Text>2.祈愿池奖品: </Text>
          {levelItems.map((item, index) => {
            return (
              <Text key={`${item.id}_${index}`} className={styles.listItem}>
                <Text className={styles.highlight}>
                  {item.shortDesc} (奖品等级: {LEVEL_TITLES[index]})
                </Text>
              </Text>
            );
          })}
        </View>
        <View className={styles.rule}>3.祈愿后奖品将自动发放至您的账户中</View>
      </View>
    );
  }, [luckDraw]);

  return (
    <View className={styles.wrapper}>
      <View className={styles.drawWrapper}>
        <View className={styles.header}>今日幸运抽奖</View>
        <View className={styles.secondary}>我的祈愿券：3张</View>
        <View className={styles.luckyWrapper}>
          {LuckyCanvas}
          {/* <LuckyWheel
            width={300}
            prizes={[
              { id: '1', text: '1积分', type: 'points', range: 12 },
              { id: '2', text: '3积分', type: 'points', range: 7 },
              { id: '3', text: '谢谢惠顾', type: 'none', range: 12 },
              { id: '4', text: '5积分', type: 'points', range: 5 },
              { id: '5', text: '5折券', type: 'coupon', range: 1 },
              { id: '6', text: '1积分', type: 'points', range: 12 },
              { id: '7', text: '3积分', type: 'points', range: 7 },
              { id: '8', text: '8折券', type: 'coupon', range: 3 },
              { id: '9', text: '谢谢惠顾', type: 'none', range: 12 },
              { id: '10', text: '1积分', type: 'points', range: 12 },
            ]}
            onEnd={(id, text) => {
              // showToast({
              //   title: `恭喜你获得${text}`,
              // });
            }}
          /> */}
        </View>
        {LuckyRule}
        {/* <View className={styles.ruleWrapper}>
          <View className={styles.title}>祈愿信息</View>
          <View className={styles.rule}>
            1.每次祈愿消耗 <Text className={styles.highlight}>1</Text> 张祈愿券
          </View>
          <View className={styles.rule}>
            <Text>2.祈愿池奖品: </Text>
            <Text className={styles.listItem}>
              <Text className={styles.highlight}>5折券 (奖品等级: SSR)</Text>
            </Text>
            <Text className={styles.listItem}>
              <Text className={styles.highlight}>5积分 (奖品等级: SR)</Text>
            </Text>
            <Text className={styles.listItem}>
              <Text className={styles.highlight}>3积分 (奖品等级: R)</Text>
            </Text>
          </View>
          <View className={styles.rule}>3.祈愿后奖品将自动发放至您的账户中</View>
        </View> */}
      </View>
      <SafeAreaBar inset='bottom' />
    </View>
  );
}
